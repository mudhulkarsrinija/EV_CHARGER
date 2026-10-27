import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Station } from '../../models/station.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-wrapper">
      <div #mapContainer class="map-container"></div>
      
      <div class="map-overlay-controls">
        <button class="map-btn" (click)="resetView()" title="Fit all stations">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M12 3v18M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          Fit All
        </button>
      </div>

      <!-- Map Legend -->
      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-dot pin-ultra"></span> Ultra-Fast (&ge;150 kW)
        </div>
        <div class="legend-item">
          <span class="legend-dot pin-fast"></span> DC Fast (50–149 kW)
        </div>
        <div class="legend-item">
          <span class="legend-dot pin-level2"></span> Level 2 (&lt;50 kW)
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 400px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-md);
    }

    .map-container {
      width: 100%;
      height: 100%;
      min-height: 400px;
      background: #0f172a;
    }

    .map-overlay-controls {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: flex;
      gap: 8px;
    }

    .map-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(17, 24, 39, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }

    .map-btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent-blue);
      color: #fff;
    }

    .map-legend {
      position: absolute;
      bottom: 16px;
      left: 16px;
      z-index: 1000;
      background: rgba(17, 24, 39, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      box-shadow: var(--shadow-sm);
      pointer-events: auto;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1.5px solid #ffffff;
      flex-shrink: 0;
    }

    @media (max-width: 640px) {
      .map-legend {
        display: none;
      }
    }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  @Input() stations: Station[] = [];
  @Input() selectedStationId: string | null = null;

  @Output() selectStation = new EventEmitter<Station>();
  @Output() openDirections = new EventEmitter<Station>();

  private map: L.Map | null = null;
  private markersMap = new Map<string, L.Marker>();
  private markerLayerGroup: L.LayerGroup | null = null;

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stations'] && !changes['stations'].firstChange) {
      this.updateMarkers();
    }
    if (changes['selectedStationId'] && this.selectedStationId) {
      const station = this.stations.find(s => s.id === this.selectedStationId);
      if (station) {
        this.panToStation(station);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (!this.mapContainer || this.map) return;

    // Center on US West coast default
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      minZoom: 3,
      maxZoom: 18
    }).setView([37.7749, -122.4194], 10);

    // CartoDB Dark Matter tiles (OpenStreetMap-based)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    this.markerLayerGroup = L.layerGroup().addTo(this.map);

    // Invalidate size once container renders
    setTimeout(() => {
      this.map?.invalidateSize();
      this.resetView();
    }, 250);
  }

  public updateMarkers(): void {
    if (!this.map || !this.markerLayerGroup) return;

    this.markerLayerGroup.clearLayers();
    this.markersMap.clear();

    if (this.stations.length === 0) return;

    this.stations.forEach(station => {
      let speedClass = 'pin-level2';
      let speedLabel = 'L2';
      if (station.powerKw >= 150) {
        speedClass = 'pin-ultra';
        speedLabel = `${station.powerKw}k`;
      } else if (station.powerKw >= 50) {
        speedClass = 'pin-fast';
        speedLabel = `${station.powerKw}k`;
      }

      const icon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-station-pin ${speedClass}" style="width: 34px; height: 34px;">
                 ⚡
               </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([station.latitude, station.longitude], { icon });

      // Create popup HTML
      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '220px';
      popupContent.innerHTML = `
        <div style="font-size: 15px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">
          ${this.escapeHtml(station.name)}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
          ${this.escapeHtml(station.address)}, ${this.escapeHtml(station.city)}
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
          <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
            ${station.powerKw} kW
          </span>
          <span style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
            $${station.pricingPerKwh.toFixed(2)}/kWh
          </span>
          <span style="background: #1f2937; color: #cbd5e1; border: 1px solid #374151; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
            ${this.escapeHtml(station.operator)}
          </span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button id="popup-btn-select-${station.id}" style="flex: 1; background: #10b981; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
            View Details
          </button>
          <button id="popup-btn-dir-${station.id}" style="background: #1f2937; color: #38bdf8; border: 1px solid #374151; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer;" title="Google Maps Directions">
            ↗ Maps
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btnSelect = document.getElementById(`popup-btn-select-${station.id}`);
        if (btnSelect) {
          btnSelect.onclick = (e) => {
            e.stopPropagation();
            this.selectStation.emit(station);
          };
        }

        const btnDir = document.getElementById(`popup-btn-dir-${station.id}`);
        if (btnDir) {
          btnDir.onclick = (e) => {
            e.stopPropagation();
            this.openDirections.emit(station);
          };
        }
      });

      marker.on('click', () => {
        this.selectStation.emit(station);
      });

      if (this.markerLayerGroup) {
        marker.addTo(this.markerLayerGroup);
      }
      this.markersMap.set(station.id, marker);
    });

    if (this.stations.length > 0 && !this.selectedStationId) {
      this.resetView();
    }
  }

  public panToStation(station: Station): void {
    if (!this.map) return;
    this.map.flyTo([station.latitude, station.longitude], 14, {
      duration: 1.0
    });

    const marker = this.markersMap.get(station.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 600);
    }
  }

  public resetView(): void {
    if (!this.map || this.stations.length === 0) return;

    const latLngs = this.stations.map(s => L.latLng(s.latitude, s.longitude));
    const bounds = L.latLngBounds(latLngs);
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

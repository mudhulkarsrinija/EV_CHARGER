import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Station } from '../../models/station.model';

@Component({
  selector: 'app-station-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="operator-tag">{{ station.operator }}</span>
            <span *ngIf="station.isDemo" class="demo-tag">Sample Data</span>
          </div>
          <div class="header-actions">
            <button
              class="icon-btn fav-btn"
              [class.active]="isFavorite"
              (click)="toggleFavorite.emit(station.id)"
              [title]="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            >
              ★
            </button>
            <button class="icon-btn close-btn" (click)="close.emit()" title="Close">
              ✕
            </button>
          </div>
        </div>

        <!-- Station Title & Location -->
        <div class="station-intro">
          <h2 class="station-name">{{ station.name }}</h2>
          <p class="station-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {{ station.address }}, {{ station.city }}, {{ station.state }} {{ station.zip }}
          </p>
          <div class="coords-pill">
            GPS: {{ station.latitude | number:'1.4-4' }}, {{ station.longitude | number:'1.4-4' }}
          </div>
        </div>

        <!-- Mandatory Availability Disclaimer -->
        <div class="disclaimer-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            <strong>Static Directory Data:</strong> Station availability is not live. Operational status and open stalls are demonstration/static records.
          </div>
        </div>

        <!-- Spec Highlights Grid -->
        <div class="specs-grid">
          <div class="spec-card">
            <span class="spec-label">Charging Speed</span>
            <div class="spec-value power">
              ⚡ {{ station.powerKw }} kW
            </div>
            <span class="spec-detail">{{ station.chargingSpeed }}</span>
          </div>

          <div class="spec-card">
            <span class="spec-label">Electricity Price</span>
            <div class="spec-value price">
              \${{ station.pricingPerKwh | number:'1.2-2' }}
              <span class="unit">/ kWh</span>
            </div>
            <span class="spec-detail">Est. \$15.20 for 40 kWh</span>
          </div>

          <div class="spec-card">
            <span class="spec-label">Total Ports / Bays</span>
            <div class="spec-value">
              {{ station.totalPorts }} Bays
            </div>
            <span class="spec-detail">Concurrent charging</span>
          </div>
        </div>

        <!-- Connectors Supported -->
        <div class="detail-section">
          <h4 class="section-title">Supported Connector Types</h4>
          <div class="connectors-list">
            <span *ngFor="let conn of station.connectorTypes" class="connector-pill">
              🔌 {{ conn }}
            </span>
          </div>
        </div>

        <!-- Notes / Amenities -->
        <div *ngIf="station.notes" class="detail-section">
          <h4 class="section-title">Station Notes & Surroundings</h4>
          <p class="notes-text">{{ station.notes }}</p>
        </div>

        <!-- Actions Footer -->
        <div class="modal-footer">
          <div class="footer-left">
            <button class="action-btn edit-btn" (click)="editStation.emit(station)">
              ✎ Edit Station
            </button>
            <button class="action-btn delete-btn" (click)="deleteStation.emit(station.id)">
              🗑 Delete
            </button>
          </div>

          <div class="footer-right">
            <button class="action-btn calc-btn" (click)="useInCalculator.emit(station)">
              ⚡ Calculate Cost
            </button>
            <button class="action-btn directions-btn" (click)="openDirections(station)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Directions in Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .modal-dialog {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .operator-tag {
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: #38bdf8;
      padding: 3px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
    }

    .demo-tag {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .fav-btn.active {
      color: #fbbf24;
      border-color: rgba(251, 191, 36, 0.4);
      background: rgba(251, 191, 36, 0.15);
    }

    .close-btn:hover {
      color: var(--accent-red);
      border-color: rgba(239, 68, 68, 0.4);
    }

    .station-name {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .station-location {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .coords-pill {
      display: inline-block;
      font-family: monospace;
      font-size: 11px;
      color: var(--text-muted);
      background: var(--bg-secondary);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
    }

    .disclaimer-banner {
      display: flex;
      gap: 10px;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      font-size: 12px;
      color: #fde68a;
      line-height: 1.4;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
    }

    .spec-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .spec-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .spec-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .spec-value.power {
      color: var(--accent-green);
    }

    .spec-value.price {
      color: var(--accent-blue);
    }

    .spec-value .unit {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }

    .spec-detail {
      font-size: 11px;
      color: var(--text-muted);
    }

    .detail-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .connectors-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .connector-pill {
      background: #1f2937;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
    }

    .notes-text {
      font-size: 13px;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      padding: 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .footer-left, .footer-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 9px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .edit-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }
    .edit-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
      border-color: var(--border-focus);
    }

    .delete-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: var(--accent-red);
      color: #fff;
    }

    .calc-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--accent-green);
      color: var(--accent-green);
    }
    .calc-btn:hover {
      background: rgba(16, 185, 129, 0.15);
    }

    .directions-btn {
      background: linear-gradient(135deg, var(--accent-blue), #0284c7);
      color: white;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
    }
    .directions-btn:hover {
      background: linear-gradient(135deg, #38bdf8, var(--accent-blue));
    }
  `]
})
export class StationDetailsComponent {
  @Input() station!: Station;
  @Input() isFavorite: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() editStation = new EventEmitter<Station>();
  @Output() deleteStation = new EventEmitter<string>();
  @Output() useInCalculator = new EventEmitter<Station>();

  public openDirections(station: Station): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank');
  }
}

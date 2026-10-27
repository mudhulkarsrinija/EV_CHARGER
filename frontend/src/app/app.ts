import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPreferences, Station } from './models/station.model';
import { StorageService } from './services/storage.service';
import { ApiService, HealthResponse, AppInfoResponse } from './services/api.service';
import { MapComponent } from './components/map/map.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { StationDetailsComponent } from './components/station-details/station-details.component';
import { StationModalComponent } from './components/station-modal/station-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    CalculatorComponent,
    StationDetailsComponent,
    StationModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(CalculatorComponent) calculatorComponent?: CalculatorComponent;

  // Station Data
  public stations: Station[] = [];
  public filteredStations: Station[] = [];
  public favorites: string[] = [];

  // Filter & Search Preferences
  public preferences: FilterPreferences = {
    searchQuery: '',
    connectorType: 'ALL',
    powerCategory: 'ALL',
    sortBy: 'name',
    onlyFavorites: false
  };

  // Modals & Panels State
  public selectedStation: Station | null = null;
  public stationToEdit: Station | null = null;
  public isAddEditModalOpen = false;
  public isDetailsModalOpen = false;
  public isCalculatorOpen = false;
  public calculatorInitialPrice = 0.38;
  public isInfoModalOpen = false;

  // Backend Status
  public isBackendOnline = false;
  public backendHealth: HealthResponse | null = null;
  public backendInfo: AppInfoResponse | null = null;

  // Notification Toast
  public toastMessage: string | null = null;
  public toastType: 'success' | 'info' | 'warning' = 'success';
  private toastTimer: any = null;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to stations from Local Storage
    this.storageService.stations$.subscribe(stations => {
      this.stations = stations;
      this.applyFilters();
    });

    // 2. Subscribe to favorites from Local Storage
    this.storageService.favorites$.subscribe(favs => {
      this.favorites = favs;
      this.applyFilters();
    });

    // 3. Load saved search and filter preferences from Local Storage
    this.preferences = this.storageService.getPreferences();

    // 4. Check backend status
    this.checkBackendStatus();
  }

  public checkBackendStatus(): void {
    this.apiService.checkHealth().subscribe(health => {
      if (health) {
        this.isBackendOnline = true;
        this.backendHealth = health;
        this.apiService.getInfo().subscribe(info => {
          this.backendInfo = info;
        });
      } else {
        this.isBackendOnline = false;
      }
    });
  }

  // --- Filtering & Sorting ---

  public onSearchChange(): void {
    this.saveCurrentPreferences();
    this.applyFilters();
  }

  public onFilterChange(): void {
    this.saveCurrentPreferences();
    this.applyFilters();
  }

  public toggleFavoritesOnly(): void {
    this.preferences.onlyFavorites = !this.preferences.onlyFavorites;
    this.saveCurrentPreferences();
    this.applyFilters();
  }

  public resetFilters(): void {
    this.preferences = {
      searchQuery: '',
      connectorType: 'ALL',
      powerCategory: 'ALL',
      sortBy: 'name',
      onlyFavorites: false
    };
    this.saveCurrentPreferences();
    this.applyFilters();
    this.showToast('Filters reset to default.', 'info');
  }

  private saveCurrentPreferences(): void {
    this.storageService.savePreferences(this.preferences);
  }

  public applyFilters(): void {
    let result = [...this.stations];

    // Search query filter (name, city, address)
    if (this.preferences.searchQuery && this.preferences.searchQuery.trim() !== '') {
      const q = this.preferences.searchQuery.toLowerCase().trim();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.operator.toLowerCase().includes(q)
      );
    }

    // Connector type filter
    if (this.preferences.connectorType && this.preferences.connectorType !== 'ALL') {
      result = result.filter(s =>
        s.connectorTypes && s.connectorTypes.includes(this.preferences.connectorType)
      );
    }

    // Power category filter
    if (this.preferences.powerCategory && this.preferences.powerCategory !== 'ALL') {
      switch (this.preferences.powerCategory) {
        case 'L2':
          result = result.filter(s => s.powerKw < 50);
          break;
        case 'DC_FAST':
          result = result.filter(s => s.powerKw >= 50 && s.powerKw < 150);
          break;
        case 'DC_ULTRA':
          result = result.filter(s => s.powerKw >= 150);
          break;
      }
    }

    // Favorites only filter
    if (this.preferences.onlyFavorites) {
      result = result.filter(s => this.favorites.includes(s.id));
    }

    // Sorting
    switch (this.preferences.sortBy) {
      case 'power_desc':
        result.sort((a, b) => b.powerKw - a.powerKw);
        break;
      case 'price_asc':
        result.sort((a, b) => a.pricingPerKwh - b.pricingPerKwh);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredStations = result;
  }

  // --- Station Selection & Map Interaction ---

  public onSelectStationFromMap(station: Station): void {
    this.selectedStation = station;
    this.isDetailsModalOpen = true;
  }

  public openStationDetails(station: Station): void {
    this.selectedStation = station;
    this.isDetailsModalOpen = true;
    if (this.mapComponent) {
      this.mapComponent.panToStation(station);
    }
  }

  public panToStationOnMap(station: Station, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.selectedStation = station;
    if (this.mapComponent) {
      this.mapComponent.panToStation(station);
    }
  }

  public openDirections(station: Station): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank');
  }

  // --- Station Management (CRUD in Local Storage) ---

  public openAddStationModal(): void {
    this.stationToEdit = null;
    this.isAddEditModalOpen = true;
  }

  public openEditStationModal(station: Station, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.isDetailsModalOpen = false;
    this.stationToEdit = { ...station };
    this.isAddEditModalOpen = true;
  }

  public onSaveStation(stationData: Partial<Station>): void {
    const isNew = !stationData.id;
    const saved = this.storageService.saveStation(stationData);
    this.isAddEditModalOpen = false;
    this.stationToEdit = null;

    if (isNew) {
      this.showToast(`Station "${saved.name}" added and saved to Local Storage!`, 'success');
      // Focus on newly added station
      setTimeout(() => {
        this.selectedStation = saved;
        if (this.mapComponent) {
          this.mapComponent.panToStation(saved);
        }
      }, 300);
    } else {
      this.showToast(`Station "${saved.name}" updated in Local Storage.`, 'success');
      this.selectedStation = saved;
    }
  }

  public onDeleteStation(stationId: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    const station = this.storageService.getStationById(stationId);
    const stationName = station ? station.name : 'Station';

    const confirmed = window.confirm(`Are you sure you want to delete "${stationName}"? This action removes it from Local Storage.`);
    if (confirmed) {
      this.storageService.deleteStation(stationId);
      this.isDetailsModalOpen = false;
      this.selectedStation = null;
      this.showToast(`"${stationName}" deleted from Local Storage.`, 'info');
    }
  }

  public onResetToDemo(): void {
    const confirmed = window.confirm(
      'Reset all stations back to the original demonstration records? Any custom additions or edits will be reset.'
    );
    if (confirmed) {
      this.storageService.resetToDemoData();
      this.showToast('Reset to 16 demonstration stations complete!', 'success');
      if (this.mapComponent) {
        setTimeout(() => this.mapComponent.resetView(), 200);
      }
    }
  }

  // --- Favorites Management ---

  public toggleFavorite(stationId: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const isNowFav = this.storageService.toggleFavorite(stationId);
    const station = this.storageService.getStationById(stationId);
    const name = station ? station.name : 'Station';
    if (isNowFav) {
      this.showToast(`Added "${name}" to favorites.`, 'success');
    } else {
      this.showToast(`Removed "${name}" from favorites.`, 'info');
    }
  }

  public isStationFavorite(stationId: string): boolean {
    return this.storageService.isFavorite(stationId);
  }

  // --- Calculator Integration ---

  public openCalculator(station?: Station, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (station) {
      this.calculatorInitialPrice = station.pricingPerKwh;
    }
    this.isCalculatorOpen = true;
    this.isDetailsModalOpen = false;
  }

  public closeCalculator(): void {
    this.isCalculatorOpen = false;
  }

  // --- Toast Notification ---

  public showToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage = message;
    this.toastType = type;
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3800);
  }
}

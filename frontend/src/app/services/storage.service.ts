import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEMO_STATIONS, FilterPreferences, Station } from '../models/station.model';

const STORAGE_KEY_STATIONS = 'ev_stations';
const STORAGE_KEY_FAVORITES = 'ev_favorites';
const STORAGE_KEY_PREFERENCES = 'ev_preferences';

export const DEFAULT_PREFERENCES: FilterPreferences = {
  searchQuery: '',
  connectorType: 'ALL',
  powerCategory: 'ALL',
  sortBy: 'name',
  onlyFavorites: false
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private stationsSubject = new BehaviorSubject<Station[]>([]);
  public stations$: Observable<Station[]> = this.stationsSubject.asObservable();

  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$: Observable<string[]> = this.favoritesSubject.asObservable();

  private preferencesSubject = new BehaviorSubject<FilterPreferences>(DEFAULT_PREFERENCES);
  public preferences$: Observable<FilterPreferences> = this.preferencesSubject.asObservable();

  constructor() {
    this.initStorage();
  }

  /**
   * Initializes local storage state on application startup.
   * If ev_stations does not exist yet, initializes demonstration data.
   * Never overwrites existing user data on refresh.
   */
  private initStorage(): void {
    // 1. Initialize Stations
    const storedStationsRaw = this.safeGetItem(STORAGE_KEY_STATIONS);
    let loadedStations: Station[] = [];

    if (storedStationsRaw) {
      try {
        const parsed = JSON.parse(storedStationsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored records contain previous US demo data (e.g. San Francisco, California), migrate to Hyderabad dataset
          const hasNonHydData = parsed.some(s =>
            (s.id && s.id.startsWith('demo-')) ||
            s.city === 'San Francisco' ||
            s.state === 'CA' ||
            (s.city && s.city !== 'Hyderabad')
          );
          if (hasNonHydData) {
            const customHydStations = parsed.filter(s => s.city === 'Hyderabad');
            loadedStations = customHydStations.length > 0 ? [...customHydStations] : [...DEMO_STATIONS];
            this.persistStations(loadedStations);
          } else {
            loadedStations = parsed;
          }
        } else {
          // If empty array was stored, reseed with demonstration stations
          loadedStations = [...DEMO_STATIONS];
          this.persistStations(loadedStations);
        }
      } catch (err) {
        console.warn('EV Charge Finder: Corrupted station data in localStorage. Falling back to demonstration data.', err);
        loadedStations = [...DEMO_STATIONS];
        this.persistStations(loadedStations);
      }
    } else {
      // First run: Initialize demonstration data
      loadedStations = [...DEMO_STATIONS];
      this.persistStations(loadedStations);
    }

    this.stationsSubject.next(loadedStations);

    // 2. Initialize Favorites
    const storedFavsRaw = this.safeGetItem(STORAGE_KEY_FAVORITES);
    let loadedFavs: string[] = [];
    if (storedFavsRaw) {
      try {
        const parsedFavs = JSON.parse(storedFavsRaw);
        if (Array.isArray(parsedFavs)) {
          loadedFavs = parsedFavs;
        }
      } catch (err) {
        console.warn('EV Charge Finder: Failed to parse favorites from localStorage. Resetting to empty.', err);
      }
    }
    this.favoritesSubject.next(loadedFavs);

    // 3. Initialize Preferences
    const storedPrefsRaw = this.safeGetItem(STORAGE_KEY_PREFERENCES);
    let loadedPrefs: FilterPreferences = { ...DEFAULT_PREFERENCES };
    if (storedPrefsRaw) {
      try {
        const parsedPrefs = JSON.parse(storedPrefsRaw);
        if (parsedPrefs && typeof parsedPrefs === 'object') {
          loadedPrefs = { ...DEFAULT_PREFERENCES, ...parsedPrefs };
        }
      } catch (err) {
        console.warn('EV Charge Finder: Failed to parse preferences from localStorage. Using defaults.', err);
      }
    }
    this.preferencesSubject.next(loadedPrefs);
  }

  /**
   * Returns current snapshot of stations
   */
  public getStations(): Station[] {
    return this.stationsSubject.getValue();
  }

  /**
   * Returns a single station by its ID
   */
  public getStationById(id: string): Station | undefined {
    return this.getStations().find(s => s.id === id);
  }

  /**
   * Adds a new station or updates an existing station record.
   * Persists changes to localStorage immediately.
   */
  public saveStation(stationData: Partial<Station>): Station {
    const currentList = [...this.getStations()];
    let savedStation: Station;

    if (stationData.id) {
      // Edit existing station
      const index = currentList.findIndex(s => s.id === stationData.id);
      if (index !== -1) {
        savedStation = {
          ...currentList[index],
          ...stationData,
          updatedAt: new Date().toISOString()
        } as Station;
        currentList[index] = savedStation;
      } else {
        // Fallback create if not found
        savedStation = {
          ...stationData,
          id: stationData.id,
          createdAt: new Date().toISOString(),
          isDemo: false
        } as Station;
        currentList.unshift(savedStation);
      }
    } else {
      // Create new station
      const newId = `user-st-${Date.now()}`;
      savedStation = {
        id: newId,
        name: stationData.name || 'New Station',
        address: stationData.address || '',
        city: stationData.city || 'Hyderabad',
        state: stationData.state || 'Telangana',
        zip: stationData.zip || '500081',
        latitude: stationData.latitude || 17.4400,
        longitude: stationData.longitude || 78.3800,
        connectorTypes: stationData.connectorTypes && stationData.connectorTypes.length > 0
          ? stationData.connectorTypes
          : ['CCS-2'],
        powerKw: stationData.powerKw || 60,
        chargingSpeed: stationData.chargingSpeed || `${stationData.powerKw || 60} kW`,
        pricingPerKwh: stationData.pricingPerKwh !== undefined ? stationData.pricingPerKwh : 18.00,
        operator: stationData.operator || 'Tata Power EZ Charge',
        totalPorts: stationData.totalPorts || 2,
        isDemo: false,
        notes: stationData.notes || '',
        createdAt: new Date().toISOString()
      };
      currentList.unshift(savedStation);
    }

    this.persistStations(currentList);
    return savedStation;
  }

  /**
   * Deletes a station by ID. Also removes it from favorites if present.
   */
  public deleteStation(id: string): boolean {
    const currentList = this.getStations();
    const updated = currentList.filter(s => s.id !== id);

    if (updated.length !== currentList.length) {
      this.persistStations(updated);

      // Clean up favorite if deleted
      if (this.isFavorite(id)) {
        this.removeFavorite(id);
      }
      return true;
    }
    return false;
  }

  /**
   * Resets records back to default demonstration dataset
   */
  public resetToDemoData(): void {
    const freshDemo = [...DEMO_STATIONS];
    this.persistStations(freshDemo);
  }

  /**
   * Returns list of favorite station IDs
   */
  public getFavorites(): string[] {
    return this.favoritesSubject.getValue();
  }

  /**
   * Checks whether a station is currently marked as favorite
   */
  public isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }

  /**
   * Toggles favorite status for a station
   */
  public toggleFavorite(id: string): boolean {
    const current = this.getFavorites();
    let updated: string[];
    let isNowFav: boolean;

    if (current.includes(id)) {
      updated = current.filter(favId => favId !== id);
      isNowFav = false;
    } else {
      updated = [...current, id];
      isNowFav = true;
    }

    this.persistFavorites(updated);
    return isNowFav;
  }

  /**
   * Removes station from favorites
   */
  public removeFavorite(id: string): void {
    const current = this.getFavorites();
    const updated = current.filter(favId => favId !== id);
    this.persistFavorites(updated);
  }

  /**
   * Saves filter and search preferences
   */
  public savePreferences(prefs: FilterPreferences): void {
    const safePrefs: FilterPreferences = {
      searchQuery: prefs.searchQuery ?? '',
      connectorType: prefs.connectorType ?? 'ALL',
      powerCategory: prefs.powerCategory ?? 'ALL',
      sortBy: prefs.sortBy ?? 'name',
      onlyFavorites: !!prefs.onlyFavorites
    };
    this.safeSetItem(STORAGE_KEY_PREFERENCES, JSON.stringify(safePrefs));
    this.preferencesSubject.next(safePrefs);
  }

  /**
   * Retrieves current preferences
   */
  public getPreferences(): FilterPreferences {
    return this.preferencesSubject.getValue();
  }

  // --- Internal Persistence Helpers ---

  private persistStations(stations: Station[]): void {
    this.safeSetItem(STORAGE_KEY_STATIONS, JSON.stringify(stations));
    this.stationsSubject.next(stations);
  }

  private persistFavorites(favorites: string[]): void {
    this.safeSetItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  private safeGetItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (err) {
      console.warn(`EV Charge Finder: LocalStorage read failed for key '${key}'`, err);
    }
    return null;
  }

  private safeSetItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn(`EV Charge Finder: LocalStorage write failed for key '${key}'`, err);
    }
  }
}

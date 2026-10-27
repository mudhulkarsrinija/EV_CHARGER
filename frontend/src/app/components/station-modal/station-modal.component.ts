import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CONNECTOR_OPTIONS, OPERATOR_OPTIONS, Station } from '../../models/station.model';

@Component({
  selector: 'app-station-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="title-wrap">
            <span class="icon">{{ isEditMode ? '✎' : '⚡' }}</span>
            <h2 class="modal-title">{{ isEditMode ? 'Edit Charging Station' : 'Add New Charging Station' }}</h2>
          </div>
          <button class="close-btn" (click)="cancel.emit()">✕</button>
        </div>

        <form (ngSubmit)="onSubmit()" #stationForm="ngForm" class="station-form">
          <!-- Station Name -->
          <div class="form-group">
            <label class="label">
              Station Name <span class="required">*</span>
            </label>
            <input
              type="text"
              class="input"
              [(ngModel)]="formData.name"
              name="name"
              required
              minlength="3"
              placeholder="e.g. Bayfront FastCharge Hub"
              #nameInput="ngModel"
            />
            <span *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)" class="error-text">
              Station name is required (at least 3 characters).
            </span>
          </div>

          <!-- Street Address & City -->
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="label">
                Street Address <span class="required">*</span>
              </label>
              <input
                type="text"
                class="input"
                [(ngModel)]="formData.address"
                name="address"
                required
                placeholder="e.g. 500 Howard St"
                #addressInput="ngModel"
              />
              <span *ngIf="addressInput.invalid && (addressInput.dirty || addressInput.touched)" class="error-text">
                Address is required.
              </span>
            </div>

            <div class="form-group flex-1">
              <label class="label">
                City <span class="required">*</span>
              </label>
              <input
                type="text"
                class="input"
                [(ngModel)]="formData.city"
                name="city"
                required
                placeholder="e.g. Hyderabad"
                #cityInput="ngModel"
              />
              <span *ngIf="cityInput.invalid && (cityInput.dirty || cityInput.touched)" class="error-text">
                City is required.
              </span>
            </div>
          </div>

          <!-- State & Zip -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="label">State / Region</label>
              <input
                type="text"
                class="input"
                [(ngModel)]="formData.state"
                name="state"
                placeholder="e.g. Telangana"
              />
            </div>
            <div class="form-group flex-1">
              <label class="label">Postal Code</label>
              <input
                type="text"
                class="input"
                [(ngModel)]="formData.zip"
                name="zip"
                placeholder="e.g. 500081"
              />
            </div>
          </div>

          <!-- Coordinates -->
          <div class="coords-box">
            <div class="coords-header">
              <label class="label mb-0">GPS Coordinates <span class="required">*</span></label>
              <button type="button" class="link-btn" (click)="setHyderabadDefaults()">
                Use Hyderabad Coordinates
              </button>
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="sub-label">Latitude (-90 to 90)</label>
                <input
                  type="number"
                  class="input"
                  [(ngModel)]="formData.latitude"
                  name="latitude"
                  required
                  step="0.0001"
                  min="-90"
                  max="90"
                  placeholder="17.4474"
                  #latInput="ngModel"
                />
              </div>
              <div class="form-group flex-1">
                <label class="sub-label">Longitude (-180 to 180)</label>
                <input
                  type="number"
                  class="input"
                  [(ngModel)]="formData.longitude"
                  name="longitude"
                  required
                  step="0.0001"
                  min="-180"
                  max="180"
                  placeholder="78.3762"
                  #lngInput="ngModel"
                />
              </div>
            </div>
          </div>

          <!-- Connector Types -->
          <div class="form-group">
            <label class="label">
              Connector Types Supported <span class="required">*</span>
            </label>
            <div class="connectors-selector">
              <label *ngFor="let conn of connectorOptions" class="checkbox-pill" [class.checked]="isConnectorSelected(conn)">
                <input
                  type="checkbox"
                  [checked]="isConnectorSelected(conn)"
                  (change)="toggleConnector(conn)"
                />
                {{ conn }}
              </label>
            </div>
            <span *ngIf="connectorError" class="error-text">
              Please select at least one connector type.
            </span>
          </div>

          <!-- Power & Pricing -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="label">
                Max Charging Power (kW) <span class="required">*</span>
              </label>
              <input
                type="number"
                class="input"
                [(ngModel)]="formData.powerKw"
                name="powerKw"
                required
                min="3"
                max="500"
                placeholder="e.g. 150"
                #powerInput="ngModel"
              />
              <span *ngIf="powerInput.invalid && (powerInput.dirty || powerInput.touched)" class="error-text">
                Power must be at least 3 kW.
              </span>
            </div>

            <div class="form-group flex-1">
              <label class="label">
                Price per kWh (₹) <span class="required">*</span>
              </label>
              <input
                type="number"
                class="input"
                [(ngModel)]="formData.pricingPerKwh"
                name="pricingPerKwh"
                required
                min="0"
                max="100"
                step="0.5"
                placeholder="e.g. 18.00"
                #priceInput="ngModel"
              />
              <span *ngIf="priceInput.invalid && (priceInput.dirty || priceInput.touched)" class="error-text">
                Price is required.
              </span>
            </div>
          </div>

          <!-- Operator & Total Ports -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="label">Operator Network</label>
              <select class="input select" [(ngModel)]="formData.operator" name="operator">
                <option *ngFor="let op of operatorOptions" [value]="op">{{ op }}</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label class="label">Total Charging Ports</label>
              <input
                type="number"
                class="input"
                [(ngModel)]="formData.totalPorts"
                name="totalPorts"
                min="1"
                max="60"
                placeholder="e.g. 8"
              />
            </div>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="label">Notes / Amenities (Optional)</label>
            <textarea
              class="input textarea"
              [(ngModel)]="formData.notes"
              name="notes"
              rows="2"
              placeholder="e.g. Near coffee shop, 24/7 access, well lit..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn cancel-btn" (click)="cancel.emit()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn save-btn"
              [disabled]="stationForm.invalid || formData.connectorTypes.length === 0"
            >
              {{ isEditMode ? 'Save Changes' : 'Create Station' }}
            </button>
          </div>
        </form>
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
      background: rgba(0, 0, 0, 0.78);
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
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      padding: 24px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .icon {
      font-size: 20px;
      color: var(--accent-green);
    }

    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
    }

    .close-btn:hover {
      color: var(--text-primary);
    }

    .station-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .flex-1 { flex: 1; min-width: 140px; }
    .flex-2 { flex: 2; min-width: 200px; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .sub-label {
      font-size: 11px;
      color: var(--text-muted);
    }

    .mb-0 { margin-bottom: 0; }

    .required {
      color: var(--accent-red);
    }

    .input {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      padding: 9px 12px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .input:focus {
      border-color: var(--accent-green);
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }

    .select {
      cursor: pointer;
    }

    .textarea {
      resize: vertical;
      font-family: inherit;
    }

    .error-text {
      font-size: 11px;
      color: #f87171;
    }

    .coords-box {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 12px;
    }

    .coords-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .link-btn {
      background: transparent;
      border: none;
      color: var(--accent-blue);
      font-size: 11px;
      cursor: pointer;
      text-decoration: underline;
    }

    .connectors-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .checkbox-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
    }

    .checkbox-pill.checked {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent-green);
      color: var(--accent-green);
    }

    .checkbox-pill input {
      accent-color: var(--accent-green);
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .btn {
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .cancel-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .cancel-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .save-btn {
      background: var(--accent-green);
      border: 1px solid var(--accent-green);
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      background: var(--accent-green-hover);
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class StationModalComponent implements OnInit {
  @Input() stationToEdit: Station | null = null;

  @Output() save = new EventEmitter<Partial<Station>>();
  @Output() cancel = new EventEmitter<void>();

  public connectorOptions = CONNECTOR_OPTIONS;
  public operatorOptions = OPERATOR_OPTIONS;

  public formData: {
    id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    connectorTypes: string[];
    powerKw: number;
    chargingSpeed: string;
    pricingPerKwh: number;
    operator: string;
    totalPorts: number;
    notes: string;
  } = {
    name: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500081',
    latitude: 17.4474,
    longitude: 78.3762,
    connectorTypes: ['CCS-2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 18.00,
    operator: 'Tata Power EZ Charge',
    totalPorts: 6,
    notes: ''
  };

  public connectorError = false;

  get isEditMode(): boolean {
    return !!this.stationToEdit;
  }

  ngOnInit(): void {
    if (this.stationToEdit) {
      this.formData = {
        id: this.stationToEdit.id,
        name: this.stationToEdit.name,
        address: this.stationToEdit.address,
        city: this.stationToEdit.city,
        state: this.stationToEdit.state,
        zip: this.stationToEdit.zip,
        latitude: this.stationToEdit.latitude,
        longitude: this.stationToEdit.longitude,
        connectorTypes: [...(this.stationToEdit.connectorTypes || ['CCS-2'])],
        powerKw: this.stationToEdit.powerKw,
        chargingSpeed: this.stationToEdit.chargingSpeed,
        pricingPerKwh: this.stationToEdit.pricingPerKwh,
        operator: this.stationToEdit.operator || 'Tata Power EZ Charge',
        totalPorts: this.stationToEdit.totalPorts || 4,
        notes: this.stationToEdit.notes || ''
      };
    }
  }

  public isConnectorSelected(conn: string): boolean {
    return this.formData.connectorTypes.includes(conn);
  }

  public toggleConnector(conn: string): void {
    if (this.isConnectorSelected(conn)) {
      this.formData.connectorTypes = this.formData.connectorTypes.filter(c => c !== conn);
    } else {
      this.formData.connectorTypes.push(conn);
    }
    this.connectorError = this.formData.connectorTypes.length === 0;
  }

  public setHyderabadDefaults(): void {
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    this.formData.latitude = parseFloat((17.4400 + latOffset).toFixed(4));
    this.formData.longitude = parseFloat((78.3800 + lngOffset).toFixed(4));
    this.formData.city = 'Hyderabad';
    this.formData.state = 'Telangana';
  }

  public onSubmit(): void {
    if (this.formData.connectorTypes.length === 0) {
      this.connectorError = true;
      return;
    }

    // Auto-calculate speed description
    let speedLabel = `${this.formData.powerKw} kW`;
    if (this.formData.powerKw >= 150) {
      speedLabel = `DC Ultra-Fast (${this.formData.powerKw} kW)`;
    } else if (this.formData.powerKw >= 50) {
      speedLabel = `DC Fast (${this.formData.powerKw} kW)`;
    } else {
      speedLabel = `Level 2 (${this.formData.powerKw} kW)`;
    }
    this.formData.chargingSpeed = speedLabel;

    this.save.emit(this.formData);
  }
}

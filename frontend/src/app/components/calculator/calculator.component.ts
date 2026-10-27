import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculationInput, CalculationResult } from '../../models/station.model';

interface VehiclePreset {
  name: string;
  capacityKwh: number;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calculator-card">
      <div class="calc-header">
        <div class="header-icon">⚡</div>
        <div>
          <h3 class="calc-title">EV Charging Cost Calculator</h3>
          <p class="calc-subtitle">Estimate required energy and charging cost accurately</p>
        </div>
      </div>

      <!-- Quick Vehicle Presets -->
      <div class="presets-section">
        <label class="section-label">Quick Vehicle Battery Presets</label>
        <div class="presets-grid">
          <button
            type="button"
            *ngFor="let preset of presets"
            class="preset-btn"
            [class.active]="input.batteryCapacity === preset.capacityKwh"
            (click)="selectPreset(preset)"
          >
            {{ preset.name }} ({{ preset.capacityKwh }} kWh)
          </button>
        </div>
      </div>

      <!-- Calculator Form -->
      <div class="calc-grid">
        <!-- Battery Capacity -->
        <div class="form-group">
          <label class="field-label">
            Battery Capacity (kWh)
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              type="number"
              class="form-input"
              [(ngModel)]="input.batteryCapacity"
              (ngModelChange)="recalculate()"
              min="1"
              max="250"
              step="0.5"
              placeholder="e.g. 75"
            />
            <span class="input-unit">kWh</span>
          </div>
          <span class="field-hint">Usable battery pack size</span>
        </div>

        <!-- Electricity Price -->
        <div class="form-group">
          <label class="field-label">
            Electricity Price ($/kWh)
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              type="number"
              class="form-input"
              [(ngModel)]="input.pricePerKwh"
              (ngModelChange)="recalculate()"
              min="0"
              max="5"
              step="0.01"
              placeholder="e.g. 0.38"
            />
            <span class="input-unit">$/kWh</span>
          </div>
          <span class="field-hint">Station or grid tariff</span>
        </div>

        <!-- Current Percentage -->
        <div class="form-group">
          <label class="field-label">
            Current Battery Level
            <span class="percentage-badge current">{{ input.currentPercentage }}%</span>
          </label>
          <div class="slider-wrapper">
            <input
              type="range"
              class="form-slider current-slider"
              [(ngModel)]="input.currentPercentage"
              (ngModelChange)="recalculate()"
              min="0"
              max="99"
              step="1"
            />
          </div>
          <div class="range-labels">
            <span>0%</span>
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>

        <!-- Target Percentage -->
        <div class="form-group">
          <label class="field-label">
            Target Battery Level
            <span class="percentage-badge target">{{ input.targetPercentage }}%</span>
          </label>
          <div class="slider-wrapper">
            <input
              type="range"
              class="form-slider target-slider"
              [(ngModel)]="input.targetPercentage"
              (ngModelChange)="recalculate()"
              min="1"
              max="100"
              step="1"
            />
          </div>
          <div class="range-labels">
            <span>1%</span>
            <span>80% (Rec.)</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <!-- Battery Visualizer Bar -->
      <div class="battery-visualizer-card">
        <div class="battery-header">
          <span class="battery-label">Charge Progress Preview</span>
          <span class="battery-gain">+{{ result.chargingDelta }}% Energy Added</span>
        </div>
        <div class="battery-bar-container">
          <div class="battery-bar-outer">
            <!-- Current fill -->
            <div
              class="battery-segment current-fill"
              [style.width.%]="validCurrent"
            ></div>
            <!-- Added charge fill -->
            <div
              class="battery-segment added-fill"
              [style.left.%]="validCurrent"
              [style.width.%]="validGain"
            ></div>
          </div>
          <div class="battery-nub"></div>
        </div>
        <div class="battery-legend">
          <span class="legend-chip"><span class="legend-color current-color"></span> Current ({{ input.currentPercentage }}%)</span>
          <span class="legend-chip"><span class="legend-color added-color"></span> Charge to Add (+{{ result.chargingDelta }}%)</span>
          <span class="legend-chip"><span class="legend-color remaining-color"></span> Remaining Unused</span>
        </div>
      </div>

      <!-- Validation Error Notice -->
      <div *ngIf="!result.isValid && result.errorMessage" class="error-notice">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ result.errorMessage }}</span>
      </div>

      <!-- Results Display Box -->
      <div *ngIf="result.isValid" class="results-grid">
        <div class="result-card energy-card">
          <span class="result-label">Energy Required</span>
          <div class="result-value">
            {{ result.energyRequiredKwh | number:'1.2-2' }}
            <span class="result-unit">kWh</span>
          </div>
          <span class="result-sub">
            Formula: {{ input.batteryCapacity }} × ({{ input.targetPercentage }} - {{ input.currentPercentage }}) / 100
          </span>
        </div>

        <div class="result-card cost-card">
          <span class="result-label">Estimated Charging Cost</span>
          <div class="result-value cost-value">
            \${{ result.estimatedCost | number:'1.2-2' }}
          </div>
          <span class="result-sub">
            Formula: {{ result.energyRequiredKwh | number:'1.2-2' }} kWh × \${{ input.pricePerKwh | number:'1.2-2' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calculator-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-md);
    }

    .calc-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .header-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--accent-green);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .calc-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .calc-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .presets-section {
      margin-bottom: 20px;
    }

    .section-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .presets-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .preset-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
      border-color: var(--border-focus);
    }

    .preset-btn.active {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent-green);
      color: var(--accent-green);
      font-weight: 600;
    }

    .calc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .required {
      color: var(--accent-red);
    }

    .percentage-badge {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
    }

    .percentage-badge.current {
      background: rgba(14, 165, 233, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.4);
    }

    .percentage-badge.target {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .form-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      border-color: var(--accent-green);
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }

    .input-unit {
      position: absolute;
      right: 12px;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 500;
      pointer-events: none;
    }

    .field-hint {
      font-size: 11px;
      color: var(--text-muted);
    }

    .slider-wrapper {
      padding: 6px 0;
    }

    .form-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #1e293b;
      outline: none;
      cursor: pointer;
      accent-color: var(--accent-green);
    }

    .current-slider {
      accent-color: var(--accent-blue);
    }

    .target-slider {
      accent-color: var(--accent-green);
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }

    .battery-visualizer-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 20px;
    }

    .battery-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .battery-label {
      color: var(--text-secondary);
    }

    .battery-gain {
      color: var(--accent-green);
    }

    .battery-bar-container {
      display: flex;
      align-items: center;
      gap: 3px;
      margin-bottom: 10px;
    }

    .battery-bar-outer {
      position: relative;
      height: 24px;
      flex: 1;
      background: #0f172a;
      border-radius: 6px;
      border: 2px solid var(--border-color);
      overflow: hidden;
    }

    .battery-nub {
      width: 5px;
      height: 12px;
      background: var(--border-color);
      border-radius: 0 2px 2px 0;
    }

    .battery-segment {
      position: absolute;
      top: 0;
      bottom: 0;
      transition: all 0.3s ease;
    }

    .current-fill {
      left: 0;
      background: linear-gradient(90deg, #0284c7, #38bdf8);
    }

    .added-fill {
      background: linear-gradient(90deg, #10b981, #34d399);
      background-size: 20px 20px;
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
    }

    .battery-legend {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      font-size: 11px;
      color: var(--text-muted);
    }

    .legend-chip {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-color {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }

    .current-color { background: #0284c7; }
    .added-color { background: #10b981; }
    .remaining-color { background: #0f172a; border: 1px solid var(--border-color); }

    .error-notice {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .result-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .energy-card {
      border-left: 4px solid var(--accent-blue);
    }

    .cost-card {
      border-left: 4px solid var(--accent-green);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), var(--bg-secondary));
    }

    .result-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .result-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .cost-value {
      color: var(--accent-green);
    }

    .result-unit {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .result-sub {
      font-size: 11px;
      color: var(--text-muted);
      word-break: break-all;
    }
  `]
})
export class CalculatorComponent implements OnInit, OnChanges {
  @Input() initialPrice: number = 0.38;

  public presets: VehiclePreset[] = [
    { name: 'Tesla Model 3', capacityKwh: 60 },
    { name: 'Tesla Model Y', capacityKwh: 75 },
    { name: 'Hyundai Ioniq 5', capacityKwh: 77.4 },
    { name: 'Ford Mach-E', capacityKwh: 88 },
    { name: 'Chevy Bolt', capacityKwh: 65 }
  ];

  public input: CalculationInput = {
    batteryCapacity: 75,
    currentPercentage: 20,
    targetPercentage: 80,
    pricePerKwh: 0.38
  };

  public result: CalculationResult = {
    energyRequiredKwh: 45,
    estimatedCost: 17.1,
    chargingDelta: 60,
    isValid: true
  };

  ngOnInit(): void {
    if (this.initialPrice !== undefined && this.initialPrice !== null) {
      this.input.pricePerKwh = this.initialPrice;
    }
    this.recalculate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPrice'] && this.initialPrice) {
      this.input.pricePerKwh = this.initialPrice;
      this.recalculate();
    }
  }

  public selectPreset(preset: VehiclePreset): void {
    this.input.batteryCapacity = preset.capacityKwh;
    this.recalculate();
  }

  public recalculate(): void {
    const { batteryCapacity, currentPercentage, targetPercentage, pricePerKwh } = this.input;

    if (batteryCapacity === null || batteryCapacity === undefined || batteryCapacity <= 0) {
      this.result = {
        energyRequiredKwh: 0,
        estimatedCost: 0,
        chargingDelta: 0,
        isValid: false,
        errorMessage: 'Please enter a valid battery capacity greater than 0 kWh.'
      };
      return;
    }

    if (pricePerKwh === null || pricePerKwh === undefined || pricePerKwh < 0) {
      this.result = {
        energyRequiredKwh: 0,
        estimatedCost: 0,
        chargingDelta: 0,
        isValid: false,
        errorMessage: 'Electricity price must be 0 or greater.'
      };
      return;
    }

    if (currentPercentage === null || currentPercentage === undefined || currentPercentage < 0 || currentPercentage > 100) {
      this.result = {
        energyRequiredKwh: 0,
        estimatedCost: 0,
        chargingDelta: 0,
        isValid: false,
        errorMessage: 'Current battery percentage must be between 0% and 100%.'
      };
      return;
    }

    if (targetPercentage === null || targetPercentage === undefined || targetPercentage < 0 || targetPercentage > 100) {
      this.result = {
        energyRequiredKwh: 0,
        estimatedCost: 0,
        chargingDelta: 0,
        isValid: false,
        errorMessage: 'Target battery percentage must be between 0% and 100%.'
      };
      return;
    }

    if (targetPercentage <= currentPercentage) {
      this.result = {
        energyRequiredKwh: 0,
        estimatedCost: 0,
        chargingDelta: 0,
        isValid: false,
        errorMessage: 'Target percentage must be strictly greater than current percentage.'
      };
      return;
    }

    // Exact formulas specified in requirements:
    // Energy required (kWh) = Battery capacity × (Target percentage − Current percentage) / 100
    // Estimated cost = Energy required × Price per kWh
    const delta = targetPercentage - currentPercentage;
    const energy = (batteryCapacity * delta) / 100;
    const cost = energy * pricePerKwh;

    this.result = {
      energyRequiredKwh: energy,
      estimatedCost: cost,
      chargingDelta: delta,
      isValid: true
    };
  }

  public get validCurrent(): number {
    const curr = this.input.currentPercentage ?? 0;
    return Math.max(0, Math.min(100, curr));
  }

  public get validGain(): number {
    const curr = this.validCurrent;
    const target = Math.max(0, Math.min(100, this.input.targetPercentage ?? 0));
    return Math.max(0, target - curr);
  }
}

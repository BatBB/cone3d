import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConeService } from 'src/app/cone.service';
import { ParametersCone } from 'src/app/types.model';

@Component({
  selector: 'app-parameters-form',
  templateUrl: './parameters-form.component.html',
  styleUrls: ['./parameters-form.component.scss'],
})
export class ParametersFormComponent {
  private height = this.coneService.parametersCone.height;
  private radius = this.coneService.parametersCone.radius;
  private segments = this.coneService.parametersCone.segments;

  public parameterForm = this.fb.group({
    height: [this.height, [Validators.required, Validators.min(1)]],
    radius: [this.radius, [Validators.required, Validators.min(1)]],
    segments: [this.segments, [Validators.required, Validators.min(1)]],
  });

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private coneService: ConeService) {}

  public setParameters = () => {
    this.coneService.parametersCone =
      this.parameterForm.getRawValue() as ParametersCone;

    this.coneService
      .getTriangulationsFromServer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((triangulations) =>
        this.coneService.updateTriangulations(triangulations)
      );
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

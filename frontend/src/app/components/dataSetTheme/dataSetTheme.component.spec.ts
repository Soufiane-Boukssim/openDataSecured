import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dataSetThemeComponent } from './dataSetTheme.component';

describe('dataSetThemeComponent', () => {
  let component: dataSetThemeComponent;
  let fixture: ComponentFixture<dataSetThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dataSetThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(dataSetThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

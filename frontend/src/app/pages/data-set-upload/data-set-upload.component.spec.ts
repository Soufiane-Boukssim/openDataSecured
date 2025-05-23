import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetUploadComponent } from './data-set-upload.component';

describe('DataSetUploadComponent', () => {
  let component: DataSetUploadComponent;
  let fixture: ComponentFixture<DataSetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSetUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProviderOrganisationComponent } from './data-provider-organisation.component';

describe('DataProviderOrganisationComponent', () => {
  let component: DataProviderOrganisationComponent;
  let fixture: ComponentFixture<DataProviderOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataProviderOrganisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataProviderOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

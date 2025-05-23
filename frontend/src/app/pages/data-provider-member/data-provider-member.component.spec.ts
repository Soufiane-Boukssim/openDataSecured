import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProviderMemberComponent } from './data-provider-member.component';

describe('DataProviderMemberComponent', () => {
  let component: DataProviderMemberComponent;
  let fixture: ComponentFixture<DataProviderMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataProviderMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataProviderMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// LeafletMapComponent.ts
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit, AfterViewInit, OnDestroy { // Add AfterViewInit and OnDestroy

  @Input() datasetId?: number;
  @ViewChild('mapElement') mapElement!: ElementRef; // Add this to get a reference to the map div

  private map: L.Map | undefined;

// LeafletMapComponent.ts

  private cities: { name: string; coords: L.LatLngTuple }[] = [
    { name: 'Casablanca', coords: [33.5731, -7.5898] },
    { name: 'Rabat', coords: [34.0209, -6.8417] },
    { name: 'Marrakech', coords: [31.6295, -7.9811] },
    { name: 'Fès', coords: [34.0331, -5.0000] },
    { name: 'Tanger', coords: [35.7595, -5.8339] },
    { name: 'Agadir', coords: [30.4278, -9.5982] },
    { name: 'Meknès', coords: [33.8953, -5.5473] },
    { name: 'Oujda', coords: [34.6833, -1.9000] },
    { name: 'Kénitra', coords: [34.261, -6.586] },
    { name: 'Tétouan', coords: [35.5785, -5.3683] },
    { name: 'Safi', coords: [32.298, -9.237] },
    { name: 'Mohammédia', coords: [33.6896, -7.3828] },
    { name: 'Béni Mellal', coords: [32.3387, -6.3428] },
    { name: 'Khénifra', coords: [32.9392, -5.6687] },
    { name: 'Nador', coords: [35.1667, -2.9333] },
    { name: 'El Jadida', coords: [33.2546, -8.5008] },
    { name: 'Errachidia', coords: [31.9298, -4.4253] },
    { name: 'Laâyoune', coords: [27.1536, -13.2033] },
    { name: 'Dakhla', coords: [23.6847, -15.9579] },
    { name: 'Ouarzazate', coords: [30.9189, -6.915] },
    { name: 'Settat', coords: [33.003, -7.625] },
    { name: 'Taza', coords: [34.2182, -4.0108] },
    { name: 'Al Hoceïma', coords: [35.247, -3.936] },
    { name: 'Taourirt', coords: [34.401, -2.898] },
    { name: 'Guercif', coords: [34.225, -3.35] },
    { name: 'Larache', coords: [35.1833, -6.15] },
    { name: 'Khouribga', coords: [32.8833, -6.9] },
    { name: 'Guelmim', coords: [28.9833, -10.0667] },
    { name: 'Sidi Ifni', coords: [29.3796, -10.1852] },
    { name: 'Taroudant', coords: [30.4667, -8.8833] },
    { name: 'Essaouira', coords: [31.5125, -9.7709] },
    { name: 'Midelt', coords: [32.7667, -4.7333] },
    { name: 'Azrou', coords: [33.4402, -5.2223] },
    { name: 'Ksar El Kébir', coords: [35.0216, -5.9902] },
    { name: 'Fquih Ben Salah', coords: [32.2272, -6.7198] },
    { name: 'Jerada', coords: [34.3167, -2.1667] },
    { name: 'Sidi Slimane', coords: [34.2709, -6.0745] },
    { name: 'Berkane', coords: [34.9167, -2.3167] },
    { name: 'Boujdour', coords: [26.1264, -14.4925] },
    { name: 'Assilah', coords: [35.4667, -6.0333] }
  ];

  ngOnInit(): void {
    this.setLeafletIconPaths();
  }

  ngAfterViewInit(): void {
    // Initialize map here to ensure the div is in the DOM and rendered
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Clean up map instance when component is destroyed
    }
  }

  private setLeafletIconPaths(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/images/leaflet/marker-icon.png',
      shadowUrl: 'assets/images/leaflet/marker-shadow.png',
    });
  }

  private initMap(): void {
    // Only initialize if map hasn't been initialized
    if (!this.map) {
        this.map = L.map(this.mapElement.nativeElement).setView([33.5731, -7.5898], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.cities.forEach(city => {
          L.marker(city.coords)
            .addTo(this.map!)
            .bindPopup(city.name);
        });
    }
  }

  // Public method to get the map instance
  public getMapInstance(): L.Map | undefined {
    return this.map;
  }
}
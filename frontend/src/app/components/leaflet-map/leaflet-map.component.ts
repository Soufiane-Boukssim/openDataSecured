import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  private map: L.Map | undefined;

  private cities: { name: string; coords: L.LatLngTuple }[] = [
    { name: 'Casablanca', coords: [33.5731, -7.5898] },
    { name: 'Rabat', coords: [34.0209, -6.8417] },
    { name: 'Marrakech', coords: [31.6295, -7.9811] },
    { name: 'Fès', coords: [34.0331, -5.0000] },
    { name: 'Tanger', coords: [35.7595, -5.8339] }
  ];

  ngOnInit(): void {
    this.setLeafletIconPaths();
    this.initMap();
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
    this.map = L.map('map').setView([33.5731, -7.5898], 6);

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

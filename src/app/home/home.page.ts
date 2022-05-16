import { Component, ElementRef, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  center: any = {
    lat: 28.6468935,
    lng: 76.9531791,
  };
  markerId: string;

  constructor() {}

  ngOnInit() {
    // this.createMap();
  }

  ionViewDidEnter() {
    this.createMap();
  }

  ngAfterViewInit() {
    // this.createMap();
  }

  ngAfterContentInit() {
    // this.createMap();
  }

  ngAfterContentChecked() {
    // this.createMap();
  }

  async locate() {
    if(this.newMap) await this.newMap.enableCurrentLocation(true);
  }

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'capacitor-google-maps',
        element: this.mapRef.nativeElement,
        apiKey: environment.google_maps_api_key,
        config: {
          center: this.center,
          zoom: 13,
        },
        // forceCreate: true
      });
      console.log('newmap', this.newMap);
      // alert('newmap'+ this.newMap);
      // if(this.newMap) await this.setCamera();

        // Enable marker clustering
      // await this.newMap.enableClustering();


      // await this.newMap.enableCurrentLocation(true);

      // await this.newMap.setMapType(MapType.Satellite);
  
      await this.addMarker(this.center.lat, this.center.lng);
      await this.addListeners();
    } catch(e) {
      console.log(e);
      // alert(e);
    }
  }

  async setCamera() {
    // Move the map programmatically
    await this.newMap.setCamera({
      coordinate: {
        // lat: this.center.lat,
        // lng: this.center.lng,
        lat: 28.782991, 
        lng: 76.945626,
      },
      zoom: 13,
      // animate: true
    });

    // Enable traffic Layer
    await this.newMap.enableTrafficLayer(true);

    if(Capacitor.getPlatform() !== 'web') {
      await this.newMap.enableIndoorMaps(true);
      // await this.newMap.setMapType(MapType.Satellite);
    }


    await this.newMap.setPadding({
        top: 50,
        left: 50,
        right: 0,
        bottom: 0,
      });
  }

  async addMarkers(lat, lng) {
    // Add a marker to the map
    // if(this.markerId) this.removeMarker();
    await this.newMap.addMarkers([
      {
        coordinate: {
          lat: lat,
          lng: lng,
        },
        // title: ,
        draggable: true
      },
      {
        coordinate: {
          lat: 28.782991, 
          lng: 76.945626,
        },
        // title: ,
        draggable: true
      },
    ]);
  }
  
  async addMarker(lat, lng) {
    // Add a marker to the map
    if(this.markerId) this.removeMarker();
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng,
      },
      // title: ,
      draggable: true
    });
  }

  async removeMarker(id?) {
    await this.newMap.removeMarker(id ? id : this.markerId);
  }

  async addListeners() {
    // Handle marker click
    await this.newMap.setOnMarkerClickListener((event) => {
      console.log('setOnMarkerClickListener', event);
      this.removeMarker(event.markerId);
    });

    await this.newMap.setOnCameraMoveStartedListener((event) => {
      console.log(event);
    });

    await this.newMap.setOnCameraIdleListener((event) => {
      console.log('idle: ', event);
      // alert(event);
      this.center = {
        lat: event.latitude,
        lng: event.longitude
      }
      this.addMarker(this.center.lat, this.center.lng);
    });

    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationButtonClickListener((event) => {
      console.log('setOnMyLocationButtonClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationClickListener((event) => {
      console.log('setOnMyLocationClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });
  }

}

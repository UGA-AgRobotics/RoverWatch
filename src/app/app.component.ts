import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align:center">
      <h1>
        {{ title }}
      </h1>
    </div>

    <br><br>

    <div id="map-canvas"></div>
  `
  ,
  styles: []
})
export class AppComponent {
  title = 'Rover Watch';
}

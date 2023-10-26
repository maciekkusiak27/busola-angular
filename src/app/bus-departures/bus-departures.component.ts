import { Component, OnInit } from '@angular/core';
import { DeparturesService } from '../services/departures.service';
import { DeparturesData } from '../models/departure.model';

@Component({
  selector: 'app-bus-departures',
  templateUrl: './bus-departures.component.html',
  styleUrls: ['./bus-departures.component.scss'],
})
export class BusDeparturesComponent implements OnInit {
  directions: string[] = [];
  selectedDirection: string = '';
  stops: DeparturesData['stops'] = [];
  selectedStop: string = '';
  uniqueStops: string[] = [];
  today: string = '';
  nextDepartureTime: any;
  departuresData: DeparturesData = { stops: [] };

  constructor(private departuresService: DeparturesService) {}

  ngOnInit() {
    this.departuresService.getDeparturesData().subscribe(
      (data: any) => {
        this.departuresData = data.departuresData;
        if (this.departuresData && this.departuresData.stops) {
          this.stops = this.departuresData.stops;
          const uniqueDirections = Array.from(
            new Set(
              this.departuresData.stops.map((stop: any) => stop.direction)
            )
          );
          this.directions = uniqueDirections;
          this.selectedDirection =
            this.selectedDirection === 'Kraków'
              ? this.selectedDirection
              : 'Myślenice';
          this.today = this.getDayOfWeek(new Date());
          this.defaultStops();
        } else {
          console.error('Nieprawidłowa struktura danych z API.');
        }
      },
      (error) => {
        console.error('Błąd podczas pobierania danych z API:', error);
      }
    );
  }

  private getDayOfWeek(date: Date): string {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[date.getDay()];
  }

  get filteredStops() {
    if (!this.selectedDirection || !this.stops) {
      return [];
    }

    let filteredType: string;
    if (this.today === 'Saturday' || this.today === 'Sunday') {
      filteredType = this.today.toLowerCase();
    } else {
      filteredType = 'mon-fri';
    }

    const todayFilteredStops = this.stops.filter(
      (stop) =>
        stop.direction === this.selectedDirection && stop.type === filteredType
    );

    return todayFilteredStops.map((stop) => stop.name);
  }

  onStopChange() {
    this.nextDepartureTime = this.getNextDepartureTime(this.selectedStop);
  }

  onDirectionChange() {
    this.defaultStops();

    this.updateNextDepartureTime();
  }

  defaultStops() {
    if (this.selectedDirection === 'Myślenice') {
      this.selectedStop = 'Kraków MDA';
    } else if (this.selectedDirection === 'Kraków') {
      this.selectedStop = 'Myślenice DA';
    }
  }

  updateNextDepartureTime() {
    this.nextDepartureTime = this.getNextDepartureTime(this.selectedStop);
  }

  getDeparturesForStop(stopName: string) {
    const stop = this.stops.find((item) => item.name === stopName);
    return stop ? stop.departures : [];
  }

  getNextDepartureTime(selectedStop: string): string | undefined {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    const stop = this.stops.find((item) => item.name === selectedStop);

    if (stop) {
      const departureTimes = stop.departures.map((departure: string) => {
        const [hour, minute] = departure.split(':').map(Number);
        return hour * 60 + minute;
      });

      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const nextDepartureInMinutes = departureTimes.find(
        (time: number) => time > currentTimeInMinutes
      );

      if (nextDepartureInMinutes !== undefined) {
        const nextHour = Math.floor(nextDepartureInMinutes / 60);
        const nextMinute = nextDepartureInMinutes % 60;
        return `${nextHour.toString().padStart(2, '0')}:${nextMinute
          .toString()
          .padStart(2, '0')}`;
      }
    }

    return undefined;
  }
}

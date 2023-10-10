import { Component, OnInit } from '@angular/core';
import { departuresData } from '../data/departures';

@Component({
  selector: 'app-bus-departures',
  templateUrl: './bus-departures.component.html',
  styleUrls: ['./bus-departures.component.scss'],
})
export class BusDeparturesComponent implements OnInit {
  kierunki: string[] = [];
  selectedKierunek: string;
  przystanki = departuresData.przystanki;
  selectedPrzystanek: string;
  uniqueBusStops: string[] = [];
  today: string = '';
  nextDepartureTime: any;

  ngOnInit() {
    this.uniqueBusStops = this.getUniqueBusStops();

    const unikalneKierunki = new Set(
      departuresData.przystanki.map((przystanek) => przystanek.kierunek)
    );
    this.kierunki = Array.from(unikalneKierunki);

    this.selectedKierunek =
      this.selectedKierunek === 'Kraków' ? this.selectedKierunek : 'Myślenice';

    this.przystanki = departuresData.przystanki;

    this.today = this.getDayOfWeek(new Date());

    this.onKierunekChange();
  }

  private getUniqueBusStops(): string[] {
    const uniqueBusStopsSet = new Set<string>();
    departuresData.przystanki.forEach((przystanek) => {
      uniqueBusStopsSet.add(przystanek.kierunek);
    });
    return Array.from(uniqueBusStopsSet);
  }

  private getDayOfWeek(date: Date): string {
    const daysOfWeek = [
      'niedziela',
      'poniedziałek',
      'wtorek',
      'środa',
      'czwartek',
      'piątek',
      'sobota',
    ];
    return daysOfWeek[date.getDay()];
  }

  get filteredPrzystanki() {
    if (!this.selectedKierunek) {
      return [];
    }

    let filteredTyp: string;
    if (this.today === 'sobota' || this.today === 'niedziela') {
      filteredTyp = this.today;
    } else {
      filteredTyp = 'pon-pt';
    }

    const todayFilteredPrzystanki = this.przystanki.filter(
      (przystanek) =>
        przystanek.kierunek === this.selectedKierunek &&
        przystanek.typ === filteredTyp
    );

    return todayFilteredPrzystanki.map((przystanek) => przystanek.nazwa);
  }

  onPrzystanekChange() {
    this.nextDepartureTime = this.getNextDepartureTime(this.selectedPrzystanek);
  }

  onKierunekChange() {
    if (this.selectedKierunek === 'Myślenice') {
      this.selectedPrzystanek = 'KrakówMDA';
    } else if (this.selectedKierunek === 'Kraków') {
      this.selectedPrzystanek = 'MyśleniceDA';
    }

    this.updateNextDepartureTime();
  }

  updateNextDepartureTime() {
    this.nextDepartureTime = this.getNextDepartureTime(this.selectedPrzystanek);
  }

  getOdjazdyForPrzystanek(przystanekNazwa: string) {
    const przystanek = this.przystanki.find(
      (item) => item.nazwa === przystanekNazwa
    );
    return przystanek ? przystanek.odjazdy : [];
  }

  getNextDepartureTime(selectedPrzystanek: string): string | undefined {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    const przystanek = this.przystanki.find(
      (item) => item.nazwa === selectedPrzystanek
    );

    if (przystanek) {
      const departureTimes = przystanek.odjazdy.map((odjazd) => {
        const [hour, minute] = odjazd.split(':').map(Number);
        return hour * 60 + minute;
      });

      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const nextDepartureInMinutes = departureTimes.find(
        (time) => time > currentTimeInMinutes
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

import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { PokemonData } from '../models/pokemonData';
import { PokemonService } from '../services/pokemon.service';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [TitleCasePipe, UpperCasePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  pokemon: PokemonData;
  pokemonList: PokemonData[] = [];
  private searchSubject = new Subject<string>();

  constructor(private service: PokemonService) {
    this.pokemon = {
      id: 0, name: '',
      sprites: {
        front_default: ''
      },
      types: []
    }
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(name => {
        if (!name.trim()) return of(null);
        return this.service.getPokemon(name).pipe(
          catchError(() => {
            console.log('not found');
            return of(null);
          })
        );
      })
    ).subscribe(res => this.updatePokemon(res));

    this.getPokemon('pikachu', true);
    this.service.getAllPokemon().subscribe(res => {
      res.forEach(pokemon => {
        this.service.getPokemon(pokemon.name).subscribe({
          next: (res) => this.pokemonList.push(res),
          error: () => console.log('not found')
        });

      });
    });
  }

  getPokemon(name: string, immediate: boolean = false) {
    if (immediate) {
      if (!name.trim()) return;
      this.service.getPokemon(name).subscribe({
        next: (res) => this.updatePokemon(res),
        error: () => console.log('not found')
      });
    } else {
      this.searchSubject.next(name);
    }
  }

  private updatePokemon(res: PokemonData | null) {
    if (res) {
      this.pokemon = {
        id: res.id,
        name: res.name,
        sprites: res.sprites,
        types: res.types
      };
    }
  }
}

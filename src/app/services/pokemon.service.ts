import { Injectable } from '@angular/core';
import { PokemonData } from '../models/pokemonData';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {
  }

  getPokemon(pokemonName: string): Observable<PokemonData> {
    return this.http.get<PokemonData>(`${this.baseUrl}/${pokemonName.toLowerCase()}`);
  }

  getAllPokemon(): Observable<PokemonData[]> {
    return this.http.get<PokemonData[]>(`${this.baseUrl}?limit=100`).pipe(map((res: any) => res.results));
  }
}

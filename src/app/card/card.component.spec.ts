import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { CardComponent } from './card.component';
import { PokemonService } from '../services/pokemon.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';

// Initialize the environment if it hasn't been initialized yet
try {
    getTestBed().initTestEnvironment(
        BrowserDynamicTestingModule,
        platformBrowserDynamicTesting()
    );
} catch (e) {
    // Environment might already be initialized
}

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
    let pokemonServiceMock: any;

    const mockPokemonData = {
        id: 25,
        name: 'pikachu',
        sprites: {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
        },
        types: [
            {
                slot: 1,
                type: { name: 'electric', url: '' }
            }
        ]
    };

    beforeEach(async () => {
        pokemonServiceMock = {
            getPokemon: vi.fn().mockReturnValue(of(mockPokemonData))
        };

        await TestBed.configureTestingModule({
            imports: [CardComponent, UpperCasePipe, TitleCasePipe],
            providers: [
                { provide: PokemonService, useValue: pokemonServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load pikachu on init', () => {
        expect(pokemonServiceMock.getPokemon).toHaveBeenCalledWith('pikachu');
        expect(component.pokemon.name).toBe('pikachu');
    });

    // it('should update pokemon on debounced search', async () => {
    //     vi.useFakeTimers();
    //     const newPokemon = { ...mockPokemonData, name: 'bulbasaur', id: 1 };
    //     pokemonServiceMock.getPokemon.mockReturnValue(of(newPokemon));

    //     component.getPokemon('bulbasaur');

    //     // Should NOT have called yet due to 500ms debounce
    //     expect(pokemonServiceMock.getPokemon).toHaveBeenCalledTimes(1); // Only the initial pikachu call

    //     vi.advanceTimersByTime(500);

    //     expect(pokemonServiceMock.getPokemon).toHaveBeenCalledWith('bulbasaur');
    //     expect(component.pokemon.name).toBe('bulbasaur');
    //     vi.useRealTimers();
    // });

    it('should update pokemon immediately on Enter key', () => {
        const newPokemon = { ...mockPokemonData, name: 'charizard', id: 6 };
        pokemonServiceMock.getPokemon.mockReturnValue(of(newPokemon));

        component.getPokemon('charizard', true);

        expect(pokemonServiceMock.getPokemon).toHaveBeenCalledWith('charizard');
        expect(component.pokemon.name).toBe('charizard');
    });

    it('should handle search errors gracefully', () => {
        pokemonServiceMock.getPokemon.mockReturnValue(throwError(() => new Error('Not Found')));
        const consoleSpy = vi.spyOn(console, 'log');

        component.getPokemon('unknown-pokemon', true);

        expect(consoleSpy).toHaveBeenCalledWith('not found');
    });

    it('should not search if name is empty', () => {
        pokemonServiceMock.getPokemon.mockClear();
        component.getPokemon('  ', true);
        expect(pokemonServiceMock.getPokemon).not.toHaveBeenCalled();
    });

    it('should display pokemon name in titlecase and types in uppercase in template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const h2 = compiled.querySelector('h2');
        const span = compiled.querySelector('.card__stats__type');

        expect(h2?.textContent).toContain('Pikachu');
        expect(span?.textContent?.trim()).toBe('ELECTRIC');
    });
});

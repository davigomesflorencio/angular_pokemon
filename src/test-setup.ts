console.log('--- TEST SETUP RUNNING ---');
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach } from 'node:test';
import 'zone.js';
import 'zone.js/testing';
import { App } from './app/app';

beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [App],
        providers: [provideZonelessChangeDetection()]
    }).compileComponents();
});
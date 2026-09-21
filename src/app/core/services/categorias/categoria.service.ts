import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Categoria } from '../../class/models/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly key = 'laguarida_categorias';
  private categorias: Categoria[] = [
    { id: 1, nombre: 'Filtros' }, 
    { id: 2, nombre: 'Frenos' }, 
    { id: 3, nombre: 'Motor' },
    { id: 4, nombre: 'Suspensión' }, 
    { id: 5, nombre: 'Eléctrico' }
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(platformId)) { 
      const datos = localStorage.getItem(this.key); 
      if (datos) 
        this.categorias = JSON.parse(datos); 
    }
  }
  obtenerTodas(): Categoria[] { 
    return [...this.categorias]; 
  }

  guardar(categoria: Categoria): Categoria {
    const existe = this.categorias.some(item => item.nombre.toLowerCase() === categoria.nombre.trim().toLowerCase() && item.id !== categoria.id);
    if (existe) 
      throw new Error('La categoría ya existe.');
    const item = categoria.id ? { ...categoria, nombre: categoria.nombre.trim() } : { id: Math.max(0, ...this.categorias.map(x => x.id)) + 1, nombre: categoria.nombre.trim() };
    this.categorias = categoria.id ? this.categorias.map(x => x.id === item.id ? item : x) : [...this.categorias, item]; 
    this.persistir(); 
    return item;
  }

  eliminar(id: number): void { 
    this.categorias = this.categorias.filter(item => item.id !== id); 
    this.persistir(); 
  }

  private persistir(): void { 
    if (isPlatformBrowser(this.platformId)) 
      localStorage.setItem(this.key, JSON.stringify(this.categorias)); 
  }
}

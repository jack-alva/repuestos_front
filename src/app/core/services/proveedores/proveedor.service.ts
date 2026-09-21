import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Proveedor } from '../../class/models/proveedor';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly key = 'laguarida_proveedores';
  private proveedores: Proveedor[] = [{ 
    id: 1, 
    nombre: 'Repuestos Andinos', 
    telefono: '999 111 222', 
    correo: 'ventas@andinos.pe' 
  }];
  constructor(@Inject(PLATFORM_ID) private platformId: object) { 
    if (isPlatformBrowser(platformId)) { 
      const datos = localStorage.getItem(this.key); 
      if (datos) this.proveedores = JSON.parse(datos); 
    } 
  }

  obtenerTodos(): Proveedor[] { 
    return [...this.proveedores]; 
  }

  guardar(proveedor: Proveedor): Proveedor {
    const item = proveedor.id ? { ...proveedor } : { ...proveedor, id: Math.max(0, ...this.proveedores.map(x => x.id)) + 1 };
    this.proveedores = proveedor.id ? this.proveedores.map(x => x.id === item.id ? item : x) : [...this.proveedores, item]; 
    this.persistir(); 
    return item;
  }

  eliminar(id: number): void { 
    this.proveedores = this.proveedores.filter(item => item.id !== id); 
    this.persistir(); 
  }

  private persistir(): void { 
    if (isPlatformBrowser(this.platformId)) 
      localStorage.setItem(this.key, JSON.stringify(this.proveedores)); 
  }
}

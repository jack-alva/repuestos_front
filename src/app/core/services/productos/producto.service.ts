import { Injectable } from '@angular/core';
import { Producto } from '../../class/models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [
    {
      id: 1,
      codigo: 'REP-001',
      nombre: 'Filtro de aceite',
      descripcion: 'Filtro de aceite para motor',
      categoria: 'Filtros',
      marca: 'Bosch',
      precio: 35.90,
      stock: 25,
      imagen: '/images/filtro-aceite.jpg',
      demandaMensual: 85
    },
    {
      id: 2,
      codigo: 'REP-002',
      nombre: 'Pastillas de freno',
      descripcion: 'Juego de pastillas de freno delanteras',
      categoria: 'Frenos',
      marca: 'Brembo',
      precio: 120,
      stock: 15,
      imagen: '/images/pastillas-freno.jpg',
      demandaMensual: 72
    },
    {
      id: 3,
      codigo: 'REP-003',
      nombre: 'Bujía',
      descripcion: 'Bujía para motor de gasolina',
      categoria: 'Motor',
      marca: 'NGK',
      precio: 28.50,
      stock: 40,
      imagen: '/images/bujia.jpg',
      demandaMensual: 64
    },
    {
      id: 4,
      codigo: 'REP-004',
      nombre: 'Amortiguador delantero',
      descripcion: 'Amortiguador delantero para automóvil',
      categoria: 'Suspensión',
      marca: 'Monroe',
      precio: 280,
      stock: 8,
      imagen: '/images/amortiguador.jpg',
      demandaMensual: 51
    },
    {
      id: 5,
      codigo: 'REP-005',
      nombre: 'Correa de distribución',
      descripcion: 'Correa de distribución para motor',
      categoria: 'Motor',
      marca: 'Gates',
      precio: 95,
      stock: 12,
      imagen: '/images/correa.jpg',
      demandaMensual: 46
    },
    {
      id: 6,
      codigo: 'REP-006',
      nombre: 'Batería 12V',
      descripcion: 'Batería automotriz de 12 voltios',
      categoria: 'Eléctrico',
      marca: 'ACDelco',
      precio: 420,
      stock: 6,
      imagen: '/images/bateria.jpg',
      demandaMensual: 38
    }
  ];

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(
      producto => producto.id === id
    );
  }

  buscarProductos(texto: string): Producto[] {

    const termino = texto.toLowerCase().trim();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino) ||
      producto.marca.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  }

  obtenerCategorias(): string[] {
    return [
      ...new Set(
        this.productos.map(producto => producto.categoria)
      )
    ];
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'stock-manager';

  products: Product[] = [
    { id: 1, name: 'Notebook Gamer', quantity: 12, price: 4500.00, category: 'Eletrônicos' },
    { id: 2, name: 'Mouse Sem Fio', quantity: 45, price: 80.00, category: 'Periféricos' },
    { id: 3, name: 'Teclado Mecânico', quantity: 30, price: 250.00, category: 'Periféricos' },
    { id: 4, name: 'Monitor 27"', quantity: 8, price: 1200.00, category: 'Eletrônicos' }
  ];

  newName = '';
  newQuantity: number | null = null;
  newPrice: number | null = null;
  newCategory = '';
  
  searchTerm = '';
  selectedCategory = '';
  editIndex: number | null = null;
  currentEditId: number | null = null;

  get categories(): string[] {
    return Array.from(new Set(this.products.map(p => p.category)));
  }

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  saveProduct() {
    if (!this.newName || this.newQuantity === null || this.newPrice === null || !this.newCategory) {
      alert('Preencha todos os campos!');
      return;
    }

    if (this.currentEditId !== null) {
      const index = this.products.findIndex(p => p.id === this.currentEditId);
      if (index !== -1) {
        this.products[index] = {
          id: this.currentEditId,
          name: this.newName,
          quantity: Number(this.newQuantity),
          price: Number(this.newPrice),
          category: this.newCategory
        };
      }
      this.cancelEdit();
    } else {
      const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products.push({
        id: newId,
        name: this.newName,
        quantity: Number(this.newQuantity),
        price: Number(this.newPrice),
        category: this.newCategory
      });
      this.resetForm();
    }
  }

  editProduct(p: Product) {
    this.currentEditId = p.id;
    this.editIndex = p.id;
    this.newName = p.name;
    this.newQuantity = p.quantity;
    this.newPrice = p.price;
    this.newCategory = p.category;
  }

  cancelEdit() {
    this.currentEditId = null;
    this.editIndex = null;
    this.resetForm();
  }

  removeProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);

    this.products = this.products.map((p, index) => ({
      ...p,
      id: index + 1
    }));

    if (this.currentEditId === id) {
      this.cancelEdit();
    }
  }

  resetForm() {
    this.newName = '';
    this.newQuantity = null;
    this.newPrice = null;
    this.newCategory = '';
  }
}
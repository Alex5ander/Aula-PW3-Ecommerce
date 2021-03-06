import { Produto } from './../../interface/produto';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Categoria } from '../../interface/categoria';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-produto',
  templateUrl: './add-produto.component.html',
  styleUrls: ['./add-produto.component.css'],
})
export class AddProdutoComponent implements OnInit {
  categorias: Categoria[] = [];
  url = 'http://lucasreno.kinghost.net/loja/categorias';
  urlPost = 'http://lucasreno.kinghost.net/loja/produto';
  form: FormGroup;

  produto: Produto | undefined = undefined;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pegarDados();
    this.form = fb.group({
      id: 0,
      url: [''],
      categoria: 1,
      nome: [''],
      preco: [''],
      descricao: [''],
    });
  }

  enviarDados() {
    if (this.form.value.id === 0) {
      this.http.post<any>(this.urlPost, this.form.value).subscribe(
        (resposta) => {
          this.router.navigateByUrl('/catalogo');
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.http.put<any>(this.urlPost, this.form.value).subscribe(
        (resposta) => {
          this.router.navigateByUrl('/catalogo');
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  pegarDados() {
    this.http.get<Categoria[]>(this.url).subscribe((resposta) => {
      this.categorias = resposta;
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.http
          .get<Produto[]>(this.urlPost + '/' + params['id'])
          .subscribe((produto) => {
            this.produto = produto[0];
            this.form = this.fb.group({
              id: this.produto.idProduto,
              url: [this.produto?.imagem],
              categoria: [this.produto?.idCategoria],
              nome: [this.produto?.nome],
              preco: [this.produto?.preco],
              descricao: [this.produto?.descricao],
            });
          });
      }
    });
  }

  ngOnInit(): void {}
}

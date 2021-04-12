import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, Validators , FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

import { PaymentService } from '../services/payment.service';
import { PaymentIntentDto } from '../model/payment-intent-dto';
import { ModalComponent } from '../modal/modal.component';
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

 
 
/* --------------------- */
/*   @Input() precio: number = 0;
 */
  @Input() name: string = '';
  @Input() descripcion: string = ''; 
  @Input() precio: number = 0; 


  public stripeForm: FormGroup = this.fb.group({
    name: [this.name, [Validators.required]],
    precio: [this.precio, [Validators.required]],
    descripcion: [this.descripcion, [Validators.required]]
  });

  error: any;
 

  constructor(
    public modalService: NgbModal,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private router: Router,
    private fb: FormBuilder
    ) { }

 
  

  ngOnInit() {
  
  }



  
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };


  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  
  abrirModal(id: string, nombre: string, descripcion: string, precio: number) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.nombre = nombre;
    modalRef.componentInstance.descripcion = descripcion;
    modalRef.componentInstance.precio = precio;
  }



  buy() {
    const name = this.name;
    
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: this.precio,
            currency: 'EUR',
            description: this.descripcion
          };
          this.paymentService.pagar(paymentIntentDto).subscribe(
            ({id, description, amount } ) => {
               
          
              this.abrirModal(id , this.name, description, amount );
            //  this.router.navigate(['/']);
            }
          );
          this.error = undefined;
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
          this.error = result.error.message;
        }
      });
     
  }

}

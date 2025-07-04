import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { TYPE } from '../../constant';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() { }
  Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
})
  // toast(typeIcon = TYPE.SUCCESS, timerProgressBar: boolean = false, op: string = "") {
    
  //   Swal.fire({
  //     toast: true,
  //     position: 'top',
  //     showConfirmButton: false,
  //     icon: typeIcon,
  //     timerProgressBar,
  //     timer: 4000,
  //     title: op
  //   })
  // }
}

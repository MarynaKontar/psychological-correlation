import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {animationTime} from '../app/testing/value-compatibility/value-compatibility-answers';

export let fade = trigger('fade', [
  state('void', style({ opacity: 0 })), // полностью прозрачен в состоянии void
  transition(':enter, :leave', [ // void <=> *
    animate('2s ease-in-out')
  ])
]);

export let slide = trigger('slide', [
  state('active', style({ transform: 'translateX(0%)'})),
  state('unactive',  style({ transform: 'translateX(300%)'})),
  // state('unactive',  style({ backgroundColor: '#f00', transform: 'translateX(300%)'})),
  transition('active => unactive',
    // animate(1000, style({ transform: 'translateX(-200%)'}))
    animate(animationTime + 'ms ease-in', keyframes([
      // !!!!!! Добавить в функции setGoal(i: number, scale: Scale) паузу в 1 секунду (setTimeout (() => ..., 1000);)
      style({opacity: 1, transform: 'translateX(0%)', offset: 0}),
      style({opacity: .5, transform: 'translateX(-35px)', offset: .3}),
      style({opacity: 0, transform: 'translateX(-200%)', offset: 1})
    ]))
  ),
  transition('unactive => active',
    // animate(1000, style({ transform: 'translateX(0%) translateY(-0%)'}))
    animate(animationTime + 'ms ease-in', keyframes([
      style({opacity: 0, transform: 'translateX(200%)', offset: 0}),
      style({opacity: .5, transform: 'translateX(35px)', offset: .3}),
      style({opacity: 1, transform: 'translateX(0%)', offset: 1}),
    ]))
  )
]);

export let vanish = trigger('vanish', [
  transition('* => *',
    animate('5s ease-in', keyframes([
      style({opacity: 1, offset: 0}),
      style({opacity: .5, offset: .3}),
      style({opacity: 0, offset: 1})
    ])))
]);
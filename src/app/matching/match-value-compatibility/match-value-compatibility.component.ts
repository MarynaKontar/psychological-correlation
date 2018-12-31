import { Component, OnInit } from '@angular/core';
import {fade} from '../../../animations/testing-page-animation';
import { Chart } from 'chart.js';
import {MatchValueCompatibilityService} from '../match-value-compatibility.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ValueCompatibilityService} from '../../testing/value-compatibility.service';
import {User} from '../../profile/user';
import {AspectComment, ValuesDifferencesComment, ScaleLevel, AspectLevel} from './match-value-compatibility';
import {DomSanitizer} from '@angular/platform-browser';
import {LoginService} from '../../login/login.service';

@Component({
  selector: 'app-match-value-compatibility',
  templateUrl: './match-value-compatibility.component.html',
  styleUrls: ['./match-value-compatibility.component.scss'
    // , '../../testing/value-compatibility-profile/value-compatibility-profile.component.scss'
  ],
  animations: [
     fade
   ]
})
export class MatchValueCompatibilityComponent implements OnInit {

  usersForMatching: User[] = [];
  matches;
  valueProfilesForMatching;
  chart: Chart = [];
  chartBar: Chart = [];
  chartBars: Chart[] = [];
  canvasId: string[] = [];
  aspectLabels: string[];
  aspectMatches: number[];
  aspectComments: AspectComment[] = [];
  scaleLabels: string[] = [];
  scalesComments: ValuesDifferencesComment[] = [];
  token: string;
  image = 'https://picsum.photos/200/300?image=1080';
  icons: string[] = ['++', '+', '~', '!', '?']; // &#8776;
  icon: string[] = ['', '', '', '', '', ''];
  valueCompatibilityReportColors = [
    // 'rgba(255,69,0, 1)', // red
    // 'rgba(255,215,0, 1)', // yellow
    // 'rgba(255,165,0, 1)', // orange
    // 'rgba(173,255,47, 1)', // green
    'rgba(155,187,89, 1)', // green
    'rgba(247,150,70, 1)', // orange
    'rgba(75,172,198, 1)', // blue
    'rgba(192,80,77, 1)', // red
    'rgba(242, 242, 239, 1)' // grey
  ];
  valueCompatibilityReportColorsTransparent03 = [
    // 'rgba(255,69,0, 1)', // red
    // 'rgba(255,215,0, 1)', // yellow
    // 'rgba(255,165,0, 1)', // orange
    // 'rgba(173,255,47, 1)', // green
    'rgba(155,187,89, 0.3)', // green
    'rgba(247,150,70, 0.3)', // orange
    'rgba(75,172,198, 0.3)', // blue
    'rgba(192,80,77, 0.3)', // red
    'rgba(242, 242, 239, 0.3)' // grey
  ];
  valueCompatibilityReportColorsTransparent08 = [
    // 'rgba(255,69,0, 1)', // red
    // 'rgba(255,215,0, 1)', // yellow
    // 'rgba(255,165,0, 1)', // orange
    // 'rgba(173,255,47, 1)', // green
    'rgba(155,187,89, 0.75)', // green
    'rgba(247,150,70, 0.75)', // orange
    'rgba(75,172,198, 0.75)', // blue
    'rgba(192,80,77, 0.75)', // red
    'rgba(242, 242, 239, 0.75)' // grey
  ];
  valueCompatibilityReportColor: string[] = [];
  scaleColor = [
    'rgba(108,88,255,1)',
    'rgba(0,240,255,1)',
    'rgba(113,218,0, 1)',
    'rgba(255,237,0, 1)',
    'rgba(255,148,0, 1)',
    'rgba(255,0,0, 1)'];
  scaleLevelColors = [
    'red', // red
    'rgba(75,172,198, 1)', // blue
    'green', // green
    ];
  scaleLevelColor: string[] = [];
  hiddenButton = true;
  linearGradient = [];
  boxShadow = [];

  constructor(private matchValueCompatibilityService: MatchValueCompatibilityService,
              private valueCompatibilityService: ValueCompatibilityService,
              private loginService: LoginService,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (this.loginService.ifHaveTokenInLocalStorage()) {
      this.getUsersForMatching();
      this.router.navigate(['match']);
      this.plotRectangle();
    }
  }

  private getUsersForMatching() {
    this.matchValueCompatibilityService.getUsersForMatching()
      .subscribe(data => {
        this.usersForMatching = data;
        console.log('getUsersForMatching(): ');
        console.log(data);
        console.log(this.usersForMatching);
      });
  }
  private match() {
    // this.plotRectangle();
    // this.plotMatchDoughnut();
    this.plotValueProfilesMatching();
    this.hiddenButton = false;
  }

  private plotRectangle() {
    this.matches = this.matchValueCompatibilityService.matchPercent().
    subscribe(data => {
      console.log('matchPercent: ');
      console.log(data);

      //   DATA
      this.aspectLabels = data['matches'].map(res => res.area);
      this.aspectMatches = data['matches'].map(res => Math.round(res.result.number / 5) * 5);
      this.aspectComments = data['matches'].map(res => res.userMatchComment);
      console.log(this.aspectComments);
      // this.users = data['users'];

      //  STYLE
      const greyColor = 'rgba(242, 242, 239, 1)';
      const blackColor = 'rgba(0, 0, 10, 1)';
      const fontSizeDoughnut = 16;
      const fontSizeBar = 18;
      let i = 0;

      // ------------------------GRADIENT---------------------
      for (i = 0; i < this.aspectComments.length; i++) {
        const colorNumber =  this.getAspectColorNumber(this.aspectComments[i].level);
        this.valueCompatibilityReportColor[i] = this.valueCompatibilityReportColors[colorNumber];
        this.linearGradient[i] = this.sanitizer.bypassSecurityTrustStyle(
          'linear-gradient(to bottom, '
                                   + this.valueCompatibilityReportColorsTransparent03[colorNumber] + ' 0%, '
                                   + this.valueCompatibilityReportColorsTransparent08[colorNumber] + ' 5%, '
                                   + this.valueCompatibilityReportColors[colorNumber] + ' 100%)');
        // sanitizer.bypassSecurityTrustStyle нужен для того, чтобы не выводило Warning о style security

       this.boxShadow[i] = this.sanitizer.bypassSecurityTrustStyle(
        '15px 15px 20px ' + this.valueCompatibilityReportColorsTransparent08[colorNumber]);

      //   this.currentStyles[i] = {
      //     'backgroundColor': this.sanitizer.bypassSecurityTrustStyle(
      //     'linear-gradient(' + this.valueCompatibilityReportColorsTransparent[colorNumber] + ', '
      //     + this.valueCompatibilityReportColors[colorNumber] + ')'),
      //     'box-shadow': this.sanitizer.bypassSecurityTrustStyle(
      //     ': 20px 20px 30px ' + this.valueCompatibilityReportColorsTransparent[colorNumber] + ';')
      // };
      //   to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%


      }
      // this.aspectComments.forEach(aspectComment => {
      //   this.valueCompatibilityReportColor[i] = this.getAspectColorNumber(aspectComment.level);
      //   this.linearGradient[i] = this.sanitizer.bypassSecurityTrustStyle(
      //     'linear-gradient(' + this.valueCompatibilityReportColor[i] + ', ' + this.valueCompatibilityReportColorsTransparent[i] + ')');
      //   this.boxShaddow = { 'background-color': 'linear-gradient(orange, green)' };
      //   // this.boxShaddow = { 'color': 'green' };
      //   // this.linearGradient[i] = 'linear-gradient(orange, green)';
      //   i = i + 1;
      // });



      //                 PLUGIN TO CHANGE COLOR DEPENDING ON ASPECT VALUE
      // https://jsfiddle.net/4f3y1yLx/
      // const backgroundColorPlugin = {
      //   // Affects the `beforeUpdate` event
      //   beforeUpdate: function(chart) {
      //     const options = chart.config.options;
      //     if (options.colorChange) {
      //       const backgroundColor = [];
      //       const borderColor = [];
      //
      //       // For every data we have ...
      //       for (let i = 0; i < chart.config.data.datasets[0].data.length; i++) {
      //
      //         let bacColor = this.valueCompatibilityReportColors[0];
      //         // const dat = chart.config.data.datasets[0].data[i].r; // for type: 'bubble',
      //         const dat = chart.config.data.datasets[0].data[i];
      //
      //         if (dat < 20) {
      //           bacColor = this.valueCompatibilityReportColors[0];
      //         } else {
      //           if (dat < 40) {
      //             bacColor = this.valueCompatibilityReportColors[1];
      //           } else {
      //             if (dat < 60) {
      //               bacColor = this.valueCompatibilityReportColors[2];
      //             } else {
      //               bacColor = this.valueCompatibilityReportColors[3];
      //             }
      //           }
      //         }
      //         // Push this new valueCompotibilityReportColor to both background and border arrays
      //         backgroundColor.push(bacColor);
      //         borderColor.push(greyColor);
      //       }
      //
      //       // Updates the chart bars valueCompotibilityReportColor properties
      //       chart.config.data.datasets[0].backgroundColor = backgroundColor;
      //       chart.config.data.datasets[0].borderColor = borderColor;
      //     }
      //   }
      // };

// Register the plugin to the chart's plugin service to activate it
//       Chart.pluginService.register(backgroundColorPlugin);


      //                    CANVASBAR
      // for (let i = 0; i < 4; i++) {
      //   this.canvasId[i] = 'chartBar' + this.aspectLabels[i];
      //   const label = this.aspectLabels[i];
      //   const max: number = this.aspectMatches[i];
      //   const level = this.aspectComments[i].levelName;
      //   console.log('canvasId[i]: ');
      //   console.log(this.canvasId[i]);
      //   this.chartBars[i] = new Chart(this.canvasId[i], {
      //     type: 'horizontalBar',
      //     data: {
      //       labels: [this.aspectLabels[i]],
      //       datasets: [
      //         {
      //           data: [this.aspectMatches[i]],
      //           // borderColor: [valueCompotibilityReportColor[i]],
      //           // backgroundColor: [valueCompotibilityReportColor[i]],
      //           borderWidth: 1.5,
      //         },
      //       ],
      //       // datasets: [ // for type: 'bubble',
      //       //   {
      //       //     data: [{x: max / 2, y: max / 2, r: max }],
      //       //     // borderColor: [valueCompotibilityReportColor[i]],
      //       //     // backgroundColor: [valueCompotibilityReportColor[i]],
      //       //     borderWidth: 1.5,
      //       //     // radius: 50,
      //       //     // hitRadius: 40,
      //       //     hoverRadius: 10,
      //       //     pointStyle: 'rectRounded',
      //       //     rotation: 50,
      //       //   },
      //       // ],
      //     },
      //     options: {
      //       // cutoutPercentage: 20,
      //       legend: {
      //         display: false,
      //       },
      //       scales: {
      //         xAxes: [{
      //           display: false, // hide x axe
      //           ticks: { // подписи по х
      //             display: false,
      //             beginAtZero: true,
      //             max: max,
      //             // min: max,
      //           },
      //           gridLines: {
      //             display: false, // hide grid
      //           },
      //           // scaleLabel: { // название оси х
      //           //   display: true,
      //           //   labelString: this.aspectLabels[i],
      //           //   fontSize: fontSizeBar,
      //           //   fontWeight: 'bold',
      //           //   padding: 20 // отступ подписи оси х
      //           // },
      //         }],
      //         yAxes: [{
      //           display: false, // hide y axe
      //           ticks: {
      //             display: false,
      //             // fontSize: fontSizeBar,
      //           },
      //           gridLines: {
      //             display: false, // hide grid
      //           },
      //         }],
      //       },
      //       colorChange: {
      //       backgroundColor: greyColor,
      //     },
      //       plugins: {
      //         datalabels: {
      //           display: true,
      //           align: 'center',
      //           anchor: 'center',
      //           // paddingTop: 20,
      //           font: {
      //             size: fontSizeBar,
      //             weight: 'bold',
      //           },
      //           color: 'rgba(248,242,236,1)',
      //           formatter: function(value, context) {
      //             return 'Уровень совместимости' + '\n'
      //               + '                 ' + value + '%' + '\n'
      //               + '          ' + level ;
      //           }
      //         }
      //       }
      //     }
      //   });
      // }



    });
  }

//   private plotMatchDoughnut() {
//     this.matchValueCompatibilityService.matchPercent().
//     subscribe(data => {
//       console.log(data);
//
//       this.aspectLabels = data['matches'].map(res => res.area);
//       this.aspectMatches = data['matches'].map(res => Math.round(res.result.number / 5) * 5);
//       // this.users = data['users'];
//
//       const valueCompotibilityReportColor = [
//         'rgba(255,69,0, 1)', // red
//         'rgba(255,215,0, 1)', // yellow
//         'rgba(255,165,0, 1)', // orange
//         'rgba(173,255,47, 1)', // green
//       ];
//       const greyColor = 'rgba(242, 242, 239, 1)';
//       const blackColor = 'rgba(0, 0, 10, 1)';
//       const fontSizeDoughnut = 16;
//
//
//       this.chart = new Chart('canvas', {
//         type: 'doughnut',
//         data: {
//           labels: this.aspectLabels,
//           datasets: [
//             {
//             data: this.aspectMatches,
//             // backgroundColor: backgroundColorPlugin,
//           }]
//         },
//
//         options: {
//           // cutoutPercentage: 20,
//           legend: {
//             display: true,
//             labels: {
//               boxWidth: 5,
//               fontSize: fontSizeDoughnut,
//               fontStyle: 'bold',
//               // valueCompotibilityReportColor: [
//               //   valueCompotibilityReportColor[0],
//               //   valueCompotibilityReportColor[1],
//               //   valueCompotibilityReportColor[2],
//               //   valueCompotibilityReportColor[3],
//               // ]
//             }
//           },
//           colorChange: {
//             backgroundColor: blackColor,
//             // borderColor: greyColor,
//           },
//           // зарегестрировала новый сервис (chart.config.options.elements.center) в Chart.pluginService.register({...
//           elements: {
//             center: {
//               // text: this.aspectMatches[3] + '%',
//               color: blackColor,
//               // fontStyle: 'Helvetica', // Default Arial
//               // sidePadding: 15 //Default 20 (as a percentage)
//             }
//           },
//
//           plugins: {
//             datalabels: {
//               display: true,
//               align: 'center',
//               anchor: 'center',
//               font: {
//                 size: fontSizeDoughnut,
//                 weight: 'bold'
//               },
//               formatter: function(value) {
//                 return value + '%';
//               }
//             }
//           }
//         }
//       });
//       console.log(this.chart);
//     });
//   }

  private plotValueProfilesMatching() {
    const principalMatch = [];
    // const userForMatchingLabels: string[] = [];
    const userForMatchingMatch = [];
    let userForMatchingStick;

    this.valueProfilesForMatching = this.matchValueCompatibilityService.getValueProfilesForMatching(this.usersForMatching[0])
      .subscribe(response => {
        console.log(response);

        response.valueProfiles.forEach(valueProfile => {
          if (valueProfile.isPrincipalUser) {
            valueProfile.valueProfileElements.forEach(valueProfileElement => {
              this.scaleLabels.push(valueProfileElement.scaleName.toUpperCase());
              principalMatch.push(Math.round(valueProfileElement.percentResult / 5) * 5);
            });
            userForMatchingStick = '';
          } else {
            valueProfile.valueProfileElements.forEach(valueProfileElement => {
              // userForMatchingLabels.push(valueProfileElement.scaleName.toUpperCase());
              userForMatchingMatch.push(Math.round(valueProfileElement.percentResult / 5) * 5);
            });
            userForMatchingStick = this.usersForMatching[0].name;
          }
        });

        let i = 0;
        response.valuesDifferencesComments.forEach(valueDifferencesComment => {
          this.scalesComments.push(valueDifferencesComment);
          const level: ScaleLevel = valueDifferencesComment.level;
          console.log(i + level);
          const iconAndColor = this.getValuesDifferencesIconAndColor(level);
          this.icon[i] = iconAndColor[0];
          this.scaleLevelColor[i] = iconAndColor[1];
          i = i + 1;
        });


        console.log('principal: ');
        console.log(this.scaleLabels);
        console.log(principalMatch);

        const title = 'Сопоставление ценностных профилей';
        const xLabel = 'Значимость ценности';
        const userForMatchingName = this.usersForMatching[0].name;

        // max value of x axe (ближайшее большее, кратное 5)
        let maxXAxes = Math.ceil((Math.max(Math.max(...userForMatchingMatch), Math.max(...principalMatch)) + 0.5) / 10) * 10;
        if ( maxXAxes >= 100 ) { maxXAxes = 100; }
        //
        // let maxXAxes = Math.ceil((Math.max.apply(null, match) + 0.5) / 10) * 10;
        // if ( maxXAxes > 100 ) { maxXAxes = 100; }

        // Chart.defaults.global.defaultFontSize = 14;
        // const color = ['rgba(201,166,220, 1)',
        //                'rgba(186,225,255, 1)',
        //                'rgba(186,255,201, 1)',
        //                'rgba(255,255,186, 1)',
        //                'rgba(255,223,186, 1)',
        //                'rgba(255,179,186, 1)'];
        const color = ['rgba(108,88,255,1)',
                       'rgba(0,240,255,1)',
                       'rgba(113,218,0, 1)',
                       'rgba(255,237,0, 1)',
                       'rgba(255,148,0, 1)',
                       'rgba(255,0,0, 1)'];
        const greyColor = 'rgba(242, 242, 239, 1)';
        const fontSizeBar = 18;
        //                    CANVASBAR
        this.chartBar = new Chart('canvasBar', {
          type: 'horizontalBar',
          data: {
            labels: this.scaleLabels,
            datasets: [
              {
                data: userForMatchingMatch,
                borderColor: [
                  color[0],
                  color[1],
                  color[2],
                  color[3],
                  color[4],
                  color[5],
                ],
                backgroundColor: [
                  greyColor,
                  greyColor,
                  greyColor,
                  greyColor,
                  greyColor,
                  greyColor,
                ],
                borderWidth: 3,
              },
              {
                data: principalMatch,
                backgroundColor: [
                  color[0],
                  color[1],
                  color[2],
                  color[3],
                  color[4],
                  color[5],
                ],
                // borderWidth: 1
              },
            ]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: title,
              fontSize: fontSizeBar + 2,
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: fontSizeBar,
                  beginAtZero: true,
                  max: maxXAxes,
                  // Include a percent sign in the ticks
                  callback: function(value) {
                    return value + '%';
                  }
                },
                scaleLabel: {
                  display: true,
                  labelString: xLabel,
                  fontSize: fontSizeBar,
                  fontWeight: 'bold',
                  padding: 20, // отступ подписи оси х
                },
              }],
              yAxes: [{
                ticks: {
                  fontSize: fontSizeBar,
                },
              }],
            },
            legend: {
              display: false
            },
            // tooltips: { // Всплывающие подписи
            //   callbacks: {
            //     label: function(tooltipItem, data1) {
            //       let label = data1.datasets[tooltipItem.datasetIndex].data[tooltipItem.datasetIndex] || '';
            //
            //       if (label) {
            //         label += ': ';
            //       }
            //       return label;
            //     }
            //   }
            // },
            plugins: {
              datalabels: {
                display: true,
                align: 'start',
                anchor: 'end', // подписи будут "заякорены" с правого окончания горизонт.столбика,а текст в них будет слева (align: 'start')
                font: {
                  size: fontSizeBar,
                  weight: 'bold'
                },
                formatter: function(value, context, item) {
                  // return value > 4 ? value + '%' : ''; // подписи будут только для значений, начиная с 5%;
                  if (value > 4) {
                    if ( context.chart.data.datasets[0] ) { //  НЕ РАБОТАЕТ if (true ВСЕГДА); context.chart.config.data.datasets[0]
                      return value + '%'; // ПОКА НЕ РАБОТАЕТ if не буду добавлять имя
                      // return userForMatchingName.slice(0, 7) + ' ' + value + '%'; // first 7 letters of user name
                    } else { return value + '%'; }
                  } else { return ''; }
                }

              }
            }
          }
        });


      });

  }

  private getValuesDifferencesIconAndColor(level: ScaleLevel): string[] {
    let icon;
    let color;

    if (level === ScaleLevel.FULL_MATCH) {
      icon = this.icons[0];
      color = this.scaleLevelColors[2];
    } else if (level === ScaleLevel.MINOR_DIFFERENCES) {
      icon = this.icons[1];
      color = this.scaleLevelColors[2];
    } else if (level === ScaleLevel.MODERATE_DIFFERENCES) {
      icon = this.icons[2];
      color = this.scaleLevelColors[1];
    } else if (level === ScaleLevel.STRONG_DIFFERENCES) {
      icon = this.icons[3];
      color = this.scaleLevelColors[0];
    } else { icon = this.icons[4]; }

    // switch (level.valueOf()) {
    //   case ScaleLevel.FULL_MATCH:
    //     icon = this.icons[0];
    //     break;
    //   case ScaleLevel.MINOR_DIFFERENCES:
    //     icon = this.icons[1];
    //     break;
    //   case ScaleLevel.MODERATE_DIFFERENCES:
    //     icon = this.icons[2];
    //     break;
    //   case ScaleLevel.STRONG_DIFFERENCES:
    //     icon = this.icons[3];
    //     break;
    //   default: icon = this.icons[4];
    // }

    console.log(icon);
    return [icon, color] ;
  }


  private getAspectColorNumber(level: AspectLevel): number {
    let colorNumber;

    // if (level === AspectLevel.EXCELLENT) {
    //   color = this.valueCompatibilityReportColors[0];
    // } else if (level === AspectLevel.GOOD) {
    //   color = this.valueCompatibilityReportColors[1];
    // } else if (level === AspectLevel.SUFFICIENT) {
    //   color = this.valueCompatibilityReportColors[2];
    // } else if (level === AspectLevel.LOW) {
    //   color = this.valueCompatibilityReportColors[3];
    // } else { color = this.valueCompatibilityReportColors[4]; }
    // return color;

    if (level === AspectLevel.EXCELLENT) {
      colorNumber = 0;
    } else if (level === AspectLevel.GOOD) {
      colorNumber = 1;
    } else if (level === AspectLevel.SUFFICIENT) {
      colorNumber = 2;
    } else if (level === AspectLevel.LOW) {
      colorNumber = 3;
    } else { colorNumber = 4; }
    return colorNumber;
  }
}



// Chart.defaults.global.animationSteps = 50;
// Chart.defaults.global.tooltipYPadding = 16;
// Chart.defaults.global.tooltipCornerRadius = 0;
// Chart.defaults.global.tooltipTitleFontStyle = "normal";
// Chart.defaults.global.tooltipFillColor = "rgba(0,160,0,0.8)";
// Chart.defaults.global.animationEasing = "easeOutBounce";
// Chart.defaults.global.responsive = true;
// Chart.defaults.global.scaleLineColor = "black";
// Chart.defaults.global.scaleFontSize = 16;
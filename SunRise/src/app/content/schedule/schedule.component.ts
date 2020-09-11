import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {Subject, Observable } from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { map } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthenticationService } from 'src/app/services';
import 'flatpickr/dist/flatpickr.css';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  event: string;
}

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})



export class ScheduleComponent implements OnInit{
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  isDataAvailable: Promise<boolean>;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ schedule: Schedule }>>>;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fa fa-fw fa-pencil"></i>',
  //     onClick: ({event}: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     }
  //   },
  //   {
  //     label: '<i class="fa fa-fw fa-times"></i>',
  //     onClick: ({event}: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter(iEvent => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     }
  //   }
  // ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private http: HttpClient, 
    private userService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService) {
  }

  getIp(){
    return this.userService.getIp();
  }

  getUsername() {
    return this.userService.getUsername();
  };

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }


  updateEvent(event){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    var token = this.userService.getToken();    
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    var username = this.getUsername();
    var userSchedule = new FormData();
    
    if (event['id'] == undefined){
      event['id'] = "";
    }
    userSchedule.append("username", username);
    userSchedule.append("event", event['title']);
    userSchedule.append("startTime", event['start']);
    userSchedule.append("endTime", event['end']);
    userSchedule.append("id", event['id']);
    this.http.post<any>(this.getIp() + `/schedule/save/`, userSchedule, httpOptions).subscribe(
      data => {
        this.notification.blank(
          'Update Event Successfully',
          'You can now reload the calander.',
          {
            nzStyle: {
              width: '600px',
              marginLeft: '-265px'
            },
            nzClass: 'test-class'
          }
        )
      },
      error => {}
    )
  }

  reload(){
    this.events = [];
    this.getSchedule();
    // const headers = new HttpHeaders();
    // headers.append('Access-Control-Allow-Origin', '*');
    // var token = this.userService.getToken();    
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: 'Bearer ' + token
    //   })
    // };
    // var username = this.getUsername();
    // var userProfile = new FormData();
    // userProfile.append("username", username)
    
    // this.events$ = this.http
    //   .post<any>(this.getIp() + '/schedule/get/', userProfile, httpOptions)
    //   .pipe(
    //     map((results)  => {

    //       return results.map((schedule: Schedule) => {
    //         return {
    //           title: schedule.event,
    //           start: new Date(schedule.startTime),
    //           end: new Date(schedule.startTime),
    //           color: colors.red,
    //           // actions: this.actions,
    //           resizable: {
    //             beforeStart: true,
    //             afterEnd: true
    //           },
    //           draggable: true,
    //         };
    //       });
    //     })
    //   );
  }

  getSchedule(){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    var token = this.userService.getToken();    
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append("username", username)
    
    this.events$ = this.http
      .post<any>(this.getIp() + '/schedule/get/', userProfile, httpOptions)
      .pipe(
        map((results)  => {
          return results.map((schedule: Schedule) => {
            this.events.push({
              id: schedule.id,
              title: schedule.event,
              start: new Date(schedule.startTime),
              end: new Date(schedule.endTime),
              color: colors.red,
              // actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true,
            })

            return {
              title: schedule.event,
              start: new Date(schedule.startTime),
              end: new Date(schedule.endTime),
              color: colors.red,
              // actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true,
            };
          });
        })
      );
  }

  delete(event){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    var token = this.userService.getToken();    
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    var username = this.getUsername();
    var userSchedule = new FormData();
    
    if (event['id'] == undefined){
      event['id'] = "";
    }

    userSchedule.append("username", username);
    userSchedule.append("event", event['title']);
    userSchedule.append("startTime", event['start']);
    userSchedule.append("endTime", event['end']);
    userSchedule.append("id", event['id']);
    this.http.post<any>(this.getIp() + `/schedule/delete/`, userSchedule, httpOptions).subscribe(
      data => {
        this.notification.blank(
          'Delete Event Successfully',
          'You can now reload the calander.',
          {
            nzStyle: {
              width: '600px',
              marginLeft: '-265px'
            },
            nzClass: 'test-class'
          }
        )
      },
      error => {}
    )
   
  }


  ngOnInit(){
    this.getSchedule();
       
  }
}

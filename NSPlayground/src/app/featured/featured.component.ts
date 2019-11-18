import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as platform from "tns-core-modules/platform";
import * as firebase from "nativescript-plugin-firebase";
import { Message, messaging } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Router } from "@angular/router";

@Component({
  selector: "Featured",
  templateUrl: "./featured.component.html"
})
export class FeaturedComponent implements OnInit, OnDestroy {

  public areNotificationsEnabled: boolean = false;

  constructor(private router: Router, private zone: NgZone) {
    this.doRegisterPushHandlers();

    LocalNotifications.addOnMessageReceivedCallback(notificationData => {
      console.log("Local Notification received: " + JSON.stringify(notificationData));

      this.zone.run(() => {
            console.log('navigating to search');
            this.router.navigate(['/search']);
          });
    });
  }

  public ngOnInit(): void {
    this.areNotificationsEnabled = messaging.areNotificationsEnabled();
    
    //this.doGetCurrentPushToken();
    //this.scheduleLocalNotification();
  }

  public ngOnDestroy(): void {
    this.doUnsubscribeFromTopic('demo');
  }

  public scheduleLocalNotification(): void {
    LocalNotifications.schedule(
        [{
          id: 5,
          thumbnail: true,
          title: 'Richard wants your input',
          body: '"Hey man, what do you think of the new design?" (swipe down to reply, or tap to open the app)',
          forceShowWhenInForeground: true,
          at: new Date(new Date().getTime() + 10 * 1000),
          actions: [
            {
              id: "input-richard",
              type: "input",
              title: "Tap here to reply",
              placeholder: "Type to reply..",
              submitLabel: "Reply",
              launch: true,
              editable: true,
              // choices: ["Red", "Yellow", "Green"] // TODO Android only, but yet to see it in action
            }
          ]
        }])
        .then(() => {
          alert({
            title: "Notification scheduled",
            message: "ID: 5",
            okButtonText: "OK, thanks"
          });
        })
        .catch(error => console.log("doScheduleId5WithInput error: " + error));
  }

  public onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public doGetCurrentPushToken(): void {
    messaging.getCurrentPushToken()
      .then(token => {
        // may be null/undefined if not known yet
        console.log(token);
        // alert({
        //   title: "Current Push Token",
        //   message: (!token ? "Not received yet (note that on iOS this does not work on a simulator)" : token + ("\n\nSee the console log if you want to copy-paste it.")),
        //   okButtonText: "OK, thx"
        // });
      })
      .catch(err => console.log("Error in doGetCurrentPushToken: " + err));
  }

  // You could add these handlers in 'init', but if you want you can do it seperately as well.
  // The benefit being your user will not be confronted with the "Allow notifications" consent popup when 'init' runs.
  public doRegisterPushHandlers(): void {
    messaging.addOnPushTokenReceivedCallback(
      token => {
        console.log("Firebase plugin received a push token: " + token);
      }
    );

    messaging.addOnMessageReceivedCallback(
      message => {
        console.log("Push message received: " + JSON.stringify(message, this.getCircularReplacer()));

        if (message.foreground) {
          alert({
            title: message.title,
            message: message.body,
            okButtonText: "OK"
          });
        } else {
          // this.zone.run(() => {
          //   console.log('navigating to search')
          //   this.router.navigate(['/search']);
          // });
          this.scheduleLocalNotification();
        }
      }
    ).then(() => {
      console.log("Added addOnMessageReceivedCallback");
    }, err => {
      console.log("Failed to add addOnMessageReceivedCallback: " + err);
    });

    this.doSubscribeToTopic('demo');
  }

  public doSubscribeToTopic(topicName: string): void {
    messaging.subscribeToTopic(topicName).then(
      () => {
        console.log('subscribed to topic ' + topicName);
      },
      error => {
        alert({
          title: "Subscribe error",
          message: error,
          okButtonText: "OK"
        });
      }
    );
  }

  public doUnsubscribeFromTopic(topicName: string): void {
    messaging.unsubscribeFromTopic(topicName).then(
      () => {
        console.log('unsubscribed from topic ' + topicName)
      },
      error => {
        alert({
          title: "Unsubscribe error",
          message: error,
          okButtonText: "OK"
        });
      }
    );
  }

   // private setScreenName(screenName): void {
  //   firebase.analytics.setScreenName(
  //     {
  //       screenName
  //     })
  //     .then(() => console.log("Analytics screen name set to: " + screenName))
  //     .catch(err => console.log("Analytics error: " + err));
  // }
  
  private getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}

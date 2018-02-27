import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
//import {TextToSpeech} from 'ionic-native';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  matches: String[];
  isRecording = false;

  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform,
    private cd: ChangeDetectorRef, private tts: TextToSpeech) { }

  isIos() {
    return this.plt.is('ios');
  }

  playText(speaktext) {
    this.tts.speak({
      text: speaktext,
      rate: 1,
      locale: 'en-US'
    })
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  getPermission() {
    console.log("hi there..playing now");
    this.playText("can you speak this please");
    //alert("hiiiiii");
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }

  startListening() {
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {
      this.matches = matches;
      this.cd.detectChanges();
      var result = matches[0];
      console.log(result);
      //this.checkResult(result);
      //this.playText(result);
      this.manipulateResult(result.toLowerCase());
    });
    this.isRecording = true;
  }


  checkResult(result) {
    console.log("result: " + result);
    if (result.includes("what")) {
      console.log("result includes what");
    } else {
      console.log("nopes");
    }
    result = result.replace("what", "how");
    console.log(result);
  }

  manipulateResult(result) {
    console.log("manipulateResult: " + result);
    var keepListening = false;
    if (result.includes("what are you doing") || result.includes("how are you")) {
      result = "I am good, how are you?";
      keepListening = true;
    }

    if (result.includes("going fine") || result.includes("vacation")) {
      result = "how was your florida trip?";
      keepListening = true;
    }

    if (result.includes("florida") || result.includes("trip")) {
      result = "Did you go to Tampa beach?";
      keepListening = true;
    }
    if (result.includes("beach") || result.includes("tampa")) {
      result = "How was Orlando?";
      keepListening = true;
    }
    if (result.includes("orlando") || result.includes("hotel")) {
      result = "Did you enjoy swimming pool";
      keepListening = true;
    }
    if (result.includes("swimming") || result.includes("pool")) {
      result = "What about Disney and lego, did you go there too";
      keepListening = true;
    }
    if (result.includes("disney") || result.includes("leego") || result.includes("fun")) {
      result = "Looks like you had a good time.";
      keepListening = true;
    }
    if (result.includes("yes") || result.includes("yes I did")) {
      result = "cool. talk to you later";
      keepListening = true;
    }
    if (result.includes("everything")) {
      result = "everything is fine";
      keepListening = true;
    }

    if (result.includes("what is your name")) {
      result = "My Name is Timtim Tester";
      keepListening = true;
    }

    if (keepListening) {
      console.log("keepListening is true");
      this.playText(result);
      var now = new Date().getTime();
      while (new Date().getTime() < now + 2500) { /* do nothing */ };
      this.startListening();
    }

    if (this.checkNumber(result)) {
      //result = "It contains a number";
      //result = "what is " + this.changeNumber(result);
      result = "what is " + this.changeNumberRandomly(result);
      //result = this.changeNumberRandomly(result);
    }

    if (this.checkQuestions(result.toLowerCase())) {
      result = this.simpleQuestionsAndAnswers(result.toLowerCase());
    }

    this.playText(result);
    var now = new Date().getTime();
    while (new Date().getTime() < now + 1500) { /* do nothing */ };
    console.log("after 2 seconds");

    if (this.checkNumber(result)) {
      this.startListening();
    }

    if (this.checkQuestions(result.toLowerCase())) {
      console.log("checkQuestions is true");
      this.startListening();
    }

  }

  checkRegularQuestions(result) {
    console.log("checkRegularQuestions() " + result);
    if (result.includes("question") || result.includes("answers") || result.includes("gym") || result.includes("weights") ||
      result.includes("shoes") || result.includes("sportsauthority") || result.includes("company") || result.includes("projects")
      || result.includes("eggs") || result.includes("protein") || result.includes("india")
      || result.includes("religion") || result.includes("hollywood") || result.includes("movies") || result.includes("yoga")) {
      return true;
    }
    console.log("checkQuestions() returning false");
    return false;

  }

  checkQuestions(result) {
    console.log("checkQuestions() " + result);
    if (result.includes("question") || result.includes("answers") || result.includes("gym") || result.includes("weights") ||
      result.includes("shoes") || result.includes("sportsauthority") || result.includes("company") || result.includes("projects")
      || result.includes("eggs") || result.includes("protein") || result.includes("india")
      || result.includes("religion") || result.includes("hollywood") || result.includes("movies") || result.includes("yoga")) {
      return true;
    }
    console.log("checkQuestions() returning false");
    return false;

  }


  simpleQuestionsAndAnswers(result) {
    if (result.includes("question") || result.includes("answers")) {
      return "man, gym and weight";
    }
    if (result.includes("gym") || result.includes("weights")) {
      return "man, sportsauthority and shoes";
    }
    if (result.includes("shoes") || result.includes("sportsauthority")) {
      return "employee, company and projects";
    }
    if (result.includes("company") || result.includes("projects")) {
      return "eggs, protein and weightloss";
    }
    if (result.includes("protein") || result.includes("eggs")) {
      return "india, population and religion";
    }
    if (result.includes("india") || result.includes("religion")) {
      return "hollywood, bollywood and movies";
    }
    if (result.includes("movies") || result.includes("hollywood")) {
      return "yoga, meditation and spirituality";
    }
    return result;

  }

  checkNumber(result) {
    if (result.includes("1")) {
      return true;
    }
    if (result.includes("2")) {
      return true;
    }
    if (result.includes("3")) {
      return true;
    }
    if (result.includes("4")) {
      return true;
    }
    if (result.includes("5")) {
      return true;
    }
    if (result.includes("6")) {
      return true;
    }
    if (result.includes("7")) {
      return true;
    }
    if (result.includes("8")) {
      return true;
    }
    if (result.includes("9")) {
      return true;
    }

    return false;
  }

  changeNumber(result) {
    if (result.includes("9")) {
      return "2+21";
    }
    if (result.includes("8")) {
      return "5+7";
    }
    if (result.includes("7")) {
      return "4+13";
    }
    if (result.includes("6")) {
      return "7+25";
    }
    if (result.includes("5")) {
      return "3+18";
    }
    if (result.includes("4")) {
      return "6+19";
    }
    if (result.includes("3")) {
      return "8+22";
    }
    if (result.includes("2")) {
      return "7+75";
    }
    if (result.includes("1")) {
      return "9+2";
    }
    return result;
  }

  changeNumberRandomly(result) {
    var num1 = this.generateRandomInt(10);
    var num2 = this.generateRandomInt(80);
    return num2 + "+" + num1;
  }


  generateRandomInt(max) {
    var random = Math.floor(Math.random() * Math.floor(max));
    console.log("random: " + random);
    return random;
  }

}
import { Component , Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Record } from 'app/model/record';
import { RecordAnswer } from 'app/model/record-answer';
import { ExamService } from 'app/service/exam.service';
import { RecordService } from 'app/service/record.service';
import { element } from 'protractor';


@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})



export class IconsComponent implements OnInit{


    @Input()
    inId: number;    
    currentExam : any = {
        id: 0,
        is_release: true,
        duration: 15,
        exam_code: "",
        exam_name: "",
        quizSet: []
    }

    

    userAnswers : FormGroup;
    answersArray =  [];
    answersArrayMulti = [];

   

    constructor(private examService: ExamService, private router: Router
                ,private activateRoute: ActivatedRoute, private fb: FormBuilder ,
                private recordService: RecordService) {}


    ngOnInit() {
        const id = Number.parseInt(this.activateRoute.snapshot.paramMap.get('id'));
        this.examService.getById(id).subscribe(data => {
            this.currentExam = data;
            this.answersArray = new Array(this.currentExam.quizSet.length);
        });
        if(this.inId > 0) this.examService.getById(this.inId).subscribe(res => this.currentExam = res);
        this.userAnswers = this.fb.group({})
        
    }

    submit() {
        let examRecord : Record = {
            exam: {},
            recordAnswer: []
        };
        examRecord.exam.id = this.currentExam.id;
        this.currentExam.quizSet.forEach(element => {
            if(element.take_answer != null) examRecord.recordAnswer.push(element.take_answer)
        });
        this.recordService.createRecord(examRecord).subscribe(
            res => {
                console.log(res);
            },
            err => {
                console.log(err);
            }
        )
    }

    cancel() {}

    selectAnswers(answer_id, quiz) {
        quiz.take_answer = answer_id;
        console.log(this.currentExam);
    }
}
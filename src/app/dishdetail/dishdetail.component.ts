import { Component, OnInit  } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params , ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
  
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  dishcopy: Dish;
  prev: string;
  next:string
  comment: Comment;
  commentForm: FormGroup;
  // errMess: string;
  formErrors = {
    'author': '',
    'rating': '5',
    'comment': ''
  };
  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be at least 2 characters long.',
      'maxlength': 'Author Name cannot be more than 25 characters long.'
    },
    'rating': {
      'required': 'Rating is required.'
    },
    'comment': {
      'required': 'Comment is required.'
    }
  };
   visibility = 'shown';

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) { }

    ngOnInit() {
      this.createForm();
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishservice.getDish(params['id']);
      }))
            .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); this.visibility = 'shown';this.dishcopy = dish;});
     
    }
    createForm(){
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        rating: [5, [Validators.required]],
        comment: ['', [Validators.required]]
      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange(); // reset form validation message
  }
  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment); // push new comment to comment array
    // this.dishcopy.save() // save new dish object to server side
      // .subscribe(dish => { this.dish = dish; console.log(this.dish); }); // reflect changes on client side
   

    
    // reset comment form
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }
  
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
  goBack(): void {
      this.location.back();
  }
  onValueChange(data?: any) {  // optional parameter
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}

import React from 'react';

import './styles.scss';
import './query.scss';

const reviews = [
  {
    id: 1,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Using Swept has saved me over $300 in parking tickets. I love it!',
  },
  {
    id: 2,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Using Swept has saved me over $300 in parking tickets. I love it!',
  },
  {
    id: 3,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Using Swept has saved me over $300 in parking tickets. I love it!',
  },
];

const UserReviews = () => {
  return (
    <section className='user-review-wrapper'>
      {reviews.map((review) => {
        return (
          <div className='user-review' key={review.id}>
            <p>{review.review}</p>
            <p>{review.name}, {review.city}</p>
          </div>
        );
      })}
    </section>
  );
};
 
export default UserReviews;
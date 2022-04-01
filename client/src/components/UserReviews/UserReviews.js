import React from 'react';

import './styles.scss';
import './query.scss';

const reviews = [
  {
    id: 1,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Swept has saved me over $300 in parking tickets. I love it!',
  },
  {
    id: 2,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Swept has saved me over $300 in parking tickets. I love it!',
  },
  {
    id: 3,
    name: 'Bailey',
    city: 'Oak Park',
    review: 'Swept has saved me over $300 in parking tickets. I love it!',
  },
];

const UserReviews = () => {
  return (
    <section className='user-review-wrapper'>
      {reviews.map((review) => {
        return (
          <span className='user-review' key={review.id}>
            <p>{review.review}</p>
            <p>{review.name}, {review.city}</p>
          </span>
        );
      })}
    </section>
  );
};
 
export default UserReviews;
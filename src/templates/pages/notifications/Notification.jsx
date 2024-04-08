import { API, graphqlOperation } from 'aws-amplify';
import { onCreateNotification } from './graphql/subscriptions';

const user = JSON.parse(localStorage.getItem('user_data'))

API.graphql(
  graphqlOperation(onCreateNotification, { userId: user.uid })
).subscribe({
  next: (notificationData) => {
    const postId = notificationData.value.data.onCreateNotification.postId;
    console.log(`Received notification for post ${postId}`);
  },
});
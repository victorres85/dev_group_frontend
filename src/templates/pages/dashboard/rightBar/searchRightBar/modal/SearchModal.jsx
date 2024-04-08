
import Post from '../../../post/Post';
import './SearchModal.css';
import Commments from './Comments';
import CommmentInput from '../../../comments/CommentInput';


const SearchModal = ({posts, setModal}) => {
  const postsData = posts;
  console.log('postsData: ', postsData)

  return (
    <div className="searchModal d-flex w-100">
    <div className="feed">
      <div className="feedWrapper">
      {Array.isArray(postsData) && postsData.map((post) => (
        <div key={post.uid} className='d-flex flex-column w-100 gap-0 justify-content-center align-items-center border-0 p-2'
            style={{ backgroundColor:'rgb(25, 27, 30)', overflow: 'auto', position:'relative'}}>
        <div style={{ width:'85%'}}>
        <Post key={post.uid} post={post} inner={true} setModal={setModal} />
        {Array.isArray(post.comments) && post.comments.map((comment) => (
          <Commments key={comment.uid} comment={comment} inner={true} innerCount={0} setModal={setModal} />))
         
        }
        <CommmentInput  commentOn={'post'} parentUid={post.uid} placeholder={'Write a comment...'}/>
        </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

export default SearchModal;
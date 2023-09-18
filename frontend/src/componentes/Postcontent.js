

function PostContent({ post }) {
    return (
      <div className="contenedor">
        <h2>{post.title}</h2>
        <img src={`http://localhost:5000/img/${post.image}`} alt={post.title} />
        <p>{post.message}</p>
      </div>
    );
  }
  
  export default PostContent;
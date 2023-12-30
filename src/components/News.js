import React, {useEffect,useState} from 'react'
import Newsitems from './Newsitems'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props)=>{
  const [articles,setArticles] = useState([]);
  const [loading,setLoading] = useState(true);
  const[page,setPage] = useState(1);
  const[totalResults,setTotalResults] = useState(0);
  
  const capitalizeFirstLetter =(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

   useEffect(()=>{
    document.title = `${capitalizeFirstLetter(props.category)}-NewsWire`;
    updateNews();
   },[]);
  
  // const handlePreviousClick =async()=>{
  //   setPage(page-1);
  //   updateNews();
  // };
  // const handleNextClick=async ()=>{
  //   if(page+1>Math.ceil(totalResults/20)){

  //   }else{
  //    setPage(page+1);
  //    updateNews();
  //   }
  // };
  
  const updateNews = async()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  const fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  
    return (
      <div className ="container my-3">
        <h1 className ="text-center" style={{margin:"30px 0", marginTop:"90px"}}>NewsWire - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!== totalResults}
          loader={<Spinner/>}
        >
           
        <div className="row">
       
          {articles.map((element)=>{
            return  <div className="col-md-4" key = {element.url}>
            <Newsitems title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl ={element.urlToImage?element.urlToImage:"https://heise.cloudimg.io/bound/1200x1200/q85.png-lossy-85.webp-lossy-85.foil1/_www-heise-de_/imgs/18/4/5/1/6/9/8/2/05-6f1bbf900aa09c4d.jpg"} newsUrl ={element.url} author={element.author} date={element.publishedAt}/>
            </div>
          })}
        </div>
        </InfiniteScroll>
      </div>
    )
  }

News.defaultProps={
  country: "in",
  pageSize: 8,
  category:"general"
 
}
News.propTypes = {
  country :PropTypes.string,
  pageSize:PropTypes.number,
  category:PropTypes.string
}
export default News;

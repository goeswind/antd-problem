import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './less/UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';
import ring1 from './images/ring1.png';
import ring2 from './images/ring2.png';


const copyright = <Fragment>P.G. Freights All Right Reserved 版权所有：上海宝供公路快运有限公司 网站备案号：沪ICP备15039436号-1 版本号V3.1220161024</Fragment>;

class UserLayout extends React.PureComponent {
	componentDidMount(){
		var matrix=document.getElementById("matrix");
  	var context=matrix.getContext("2d");
  	console.log(document.getElementById("container").offsetHeight)
  	matrix.height=document.getElementById("container").offsetHeight;
  	matrix.width=document.getElementById("container").offsetWidth;
  	var drop=[];
  	var font_size=30;
  	var columns=matrix.width/font_size;
	  context.fillStyle="#289cda";
  	for(var i=0;i<columns;i++){
  		drop[i]=1;
  	}
  	
  	function drawMatrix(){
  
	  	context.fillStyle="rgba(0, 0,0, 0.1)"; 
	  	context.fillRect(0,0,matrix.width,matrix.height);
	  
	  	context.fillStyle="#289cda";
	  	context.font=font_size+"px";
	  	for(var i=0;i<columns;i++){
//	  		context.fillStyle="red";
	  		context.fillText(Math.floor(Math.random()*10),i*font_size,drop[i]*font_size/2);/*get 0 and 1*/

//	  		context.fillStyle="#289cda";
//	  		context.fillRect(0,0,font_size,matrix.height);/*get 0 and 1*/
//				
				
	  
	  		if(drop[i]*font_size>(matrix.height)&&Math.random()>0.95)/*reset*/
	  			drop[i]=0;
	  		drop[i]++;
	  	}
	  }
  	setInterval(drawMatrix,40);
	}
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '登录';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 登录`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container} id="container">
	      	<canvas className={styles.matrix} id="matrix"></canvas>
      		<div className={styles.ring}>
      			<img src={ring1} /><img src={ring2} />
      		</div>
          <div className={styles.content}>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

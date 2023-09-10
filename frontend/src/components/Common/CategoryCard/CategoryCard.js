import React, { Component } from 'react';
import { Avatar } from 'antd';
import "./CategoryCard.css"

class CategoryCard extends Component {
    render() {
        return (
            <div className="category-card">
                {/* <img src="/static/infobank/icons/cpu.png" alt="product-4" width="60px"> */}
                <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    src={this.props.src}
                />
                <h4>{this.props.CategoryName}</h4>
            </div>
        );
    }
}

export default CategoryCard;
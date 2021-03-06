class UsersController < ApplicationController
  
  def index
  end

  def show
    @user = User.find(params[:id])
    @you_score = @user.book_score
    @global_score = User.total_book_score
  end
  
  def fb_connect
      fb_info = MiniFB.parse_cookie_information('209106392449144', cookies) # some users may have to use their API rather than the app. ID.
      @fb_app_id = '209106392449144';
      @fb_uid = fb_info['uid']
      @global_score = User.total_book_score
      if MiniFB.verify_cookie_signature('209106392449144', "fc6cfb76f24a937d5ab6161e468b24af", cookies)
        @user = User.where(['fb_id LIKE ?', @fb_uid]).all
        if @user.any?
          @user = @user.first
        else
          @user = User.create!(:fb_id => @fb_uid)
        end
      else
        redirect_to root_path
      end
  end
  
  def update
    @user = User.find(params[:id])
    @user.update_attributes!(params[:user])
    head :ok
  end
  

end

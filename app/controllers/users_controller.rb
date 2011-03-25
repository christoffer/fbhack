class UsersController < ApplicationController
  require 'httparty'
  
  
  def index
  end

  def show
    @user = User.find(params[:id])
    @you_score = @user.book_score
    @global_score = User.total_book_score
  end
  
  def fb_connect
      @fb_info = MiniFB.parse_cookie_information('209106392449144', cookies) # some users may have to use their API rather than the app. ID.
      @fb_session = @fb_info['session_key']
      @fb_uid = @fb_info['uid']
      @fb_access_token = @fb_info['access_token']

      if MiniFB.verify_cookie_signature('209106392449144', "fc6cfb76f24a937d5ab6161e468b24af", cookies)
        @user = User.find_or_create_by_fb_id(@fb_uid)
        @fb = MiniFB::OAuthSession.new(@fb_access_token, 'en_US')
        friends = @fb.get('me/friends').data.collect {|f| f.id }
        
        ix = 0
        book_count = 0
        
        #friends.each_slice(20) do |a|
        #  ids = a.join(',')

        #  params = {:access_token => @fb_access_token}.to_query          
         # books = HTTParty.get("https://graph.facebook.com/books?#{params}&ids=#{ids}")
          
         # books.each do |b|
            
         #   book_count += b[1]['data'].size
         # end
                              
        #end
        
        #@user.friend_count = friends.size
        #@user.book_count = book_count
       # @user.save
      else
        redirect_to root_path
      end

  end

end

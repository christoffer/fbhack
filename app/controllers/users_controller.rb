class UsersController < ApplicationController
  require 'open-uri'
  
  def index
  end
  
  def fb_connect
      @fb_info = MiniFB.parse_cookie_information('209106392449144', cookies) # some users may have to use their API rather than the app. ID.
      @fb_session = @fb_info['session_key']
      @fb_uid = @fb_info['uid']
      @fb_access_token = @fb_info['access_token']

      http = Net::HTTP.new("graph.facebook.com")
      http.use_ssl = true


      if MiniFB.verify_cookie_signature('209106392449144', "fc6cfb76f24a937d5ab6161e468b24af", cookies)
        @user = User.find_or_create_by_fb_id(@fb_uid)
        @fb = MiniFB::OAuthSession.new(@fb_access_token, 'en_US')
        friends = @fb.get('me/friends').data.collect {|f| f.id }
        
        ix = 0
        books = 0
        
        friends.each_slice(10) do |a|
          ids = a.join(',')

          params = {:access_token => @fb_access_token}.to_query
          request = Net::HTTP::Get.new("/books?#{params}&ids=#{ids}")
          raise "#{request.path}"
          books = ActiveSupport::JSON.decode(request.body)
          
        end
                
      else
        redirect_to root_path
      end

  end

end

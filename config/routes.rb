Fbhack::Application.routes.draw do
  match 'connect', :to => "users#fb_connect"
  resources :users, :only => :update
  root :to => "users#index"
end

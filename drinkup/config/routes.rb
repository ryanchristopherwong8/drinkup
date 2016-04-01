Rails.application.routes.draw do
  #routes for users
  resources :users
  
  get 'signup'  => 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'

  root 'sessions#index'
  resources :events do
  	collection do
  		get 'getEvents'
  	end
  end
  match ':controller(/:action(/:id))', :via => [:get, :post]

  
end

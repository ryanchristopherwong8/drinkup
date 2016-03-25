Rails.application.routes.draw do
  #routes for users
  resources :users
  
  get 'signup'  => 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'

  root 'events#index'
  resources :events
  match ':controller(/:action(/:id))', :via => [:get, :post]

  
end

Rails.application.routes.draw do
  #routes for users
  resources :users
  get 'signup'  => 'users#new'

  root 'sessions#index'
  resources :events
  match ':controller(/:action(/:id))', :via => [:get, :post]

  
end

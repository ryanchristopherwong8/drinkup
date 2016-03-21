Rails.application.routes.draw do
  #routes for users
  root 'events#test'
  resources :users
  get 'signup'  => 'users#new'

  resources :events
  match ':controller(/:action(/:id))', :via => [:get, :post]

  
end

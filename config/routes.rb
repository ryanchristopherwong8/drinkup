Rails.application.routes.draw do

  #routes for chat and messages
  resources :chat, only: [ :create, :show] do
    resources :messages, only: [ :create]
  end

  resources :users do
    collection do
      get 'getConversations'
    end
    member do 
      get 'settings'
      patch 'saveSettings'
      patch 'removeImage'
      post 'saveConversations'
      delete 'removeConversations'
      get 'getCurrentEventsForUser'
    end
  end

  resources :events do
    collection do
      get 'getEvents'
    end
    member do 
      get 'getTopConversations'
      post 'join'
      post 'unjoin'
    end
  end
  
  get 'signup'  => 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'

  root 'sessions#index'

  match ':controller(/:action(/:id))', :via => [:get, :post]
  
end

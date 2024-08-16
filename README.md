# RestroTech - Restaurant POS System Frontend

A React-based frontend for RestroTech, providing tailored interfaces for restaurant staff to manage menus, tables, orders, and kitchen operations.

[![Demo Video](https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

## Features

### Staff Role

- **Dashboard**: Overview of restaurant operations, including current orders, table status, and daily sales.
- **Menu Management**: Add, edit, and delete menu items. Organize items by categories.
- **Table Management**: Manage table availability, add new tables, and update table details.
- **Order Management**: Create new orders, edit existing ones, and process payments.

## Technologies

- React.js: Core frontend library
- Tailwind CSS: Utility-first CSS framework for styling
- Material-UI: UI styling and components
- Chart.js: For data visualization in reports

## API Integration

The frontend communicates with the backend via a RESTful API, handling operations such as menu management, table management, and order processing.

## Future Works

- **Mobile App**: Develop a mobile application for on-the-go management and tableside ordering.
- **Customer-facing Interface**: Create a separate interface for customers to place orders directly.
- **Inventory Management**: Implement features to track ingredient usage and manage stock levels.
- **Reservation System**: Add functionality for managing table reservations.
- **Multi-language Support**: Add support for multiple languages to cater to diverse staff and customers.
- **Different Portal for Different Staff**: Create customized portals for different roles within the restaurant.

## Challenges

- **Real-time Updates**: Implementing real-time updates for order status and kitchen display was complex but achieved using WebSocket technology.
- **State Management**: Handling the complex state of multiple concurrent orders and table statuses required careful implementation.
- **Responsive Design**: Ensuring the interface works well on various devices (tablets, phones, desktop) used by staff in different restaurant areas.
- **Offline Functionality**: Implementing basic functionality during internet outages to ensure smooth restaurant operations.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (create a `.env` file based on `.env.example`)
4. Run the development server: `npm start`

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

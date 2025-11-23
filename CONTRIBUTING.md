# Contributing to Attendance Management System

Thank you for considering contributing to this project! 

## How to Contribute

### Reporting Bugs
- Use GitHub Issues
- Include detailed description
- Add steps to reproduce
- Include screenshots if applicable

### Suggesting Features
- Open a GitHub Issue
- Describe the feature clearly
- Explain use cases
- Consider implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments where needed
   - Update documentation

4. **Test your changes**
   ```bash
   npm run dev
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Add screenshots if UI changes

## Development Guidelines

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for functions

### Component Structure
```typescript
'use client' // if needed

import statements

interface Props {
  // prop types
}

export default function Component({ props }: Props) {
  // hooks
  // handlers
  // render
}
```

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable

### Testing
- Test all user flows
- Check responsive design
- Verify database operations
- Test error handling

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Auth pages
│   └── ...
├── lib/                # Utility functions
│   ├── supabase.ts    # Supabase client
│   ├── api.ts         # API functions
│   └── utils.ts       # Helper functions
├── types/              # TypeScript types
├── database/           # SQL schemas
└── public/            # Static assets
```

## Areas for Contribution

### High Priority
- [ ] Employee management UI (CRUD operations)
- [ ] Attendance reports and analytics
- [ ] Leave management dashboard
- [ ] Email notifications
- [ ] Export to CSV/PDF

### Medium Priority
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Biometric check-in
- [ ] Shift management
- [ ] Holiday calendar

### Low Priority
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Integration with HR systems
- [ ] Payroll integration

## Questions?

Feel free to open an issue for any questions or reach out via email.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

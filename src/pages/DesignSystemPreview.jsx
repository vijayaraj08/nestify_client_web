import { useState } from 'react';
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Search,
  Mail,
  Eye,
  Copy,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Users,
  Building2,
  BedDouble,
  IndianRupee,
  FileText,
} from 'lucide-react';

import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Badge,
  Card,
  Modal,
  Dropdown,
  Tooltip,
  Avatar,
  Table,
  Tabs,
  Alert,
  EmptyState,
  LoadingState,
  Skeleton,
  Pagination,
} from '../components/ui';

import { PageHeader, ContentSection, CardGrid } from '../components/layout/PageContainer';

/* ──────────────────────────────────────────
   Color Swatch Helper
   ────────────────────────────────────────── */
function ColorSwatch({ name, className, hex }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-12 h-12 rounded-lg border border-slate-200 ${className}`} />
      <span className="text-xs font-medium text-slate-700">{name}</span>
      {hex && <span className="text-xs text-slate-400">{hex}</span>}
    </div>
  );
}

function ColorRow({ label, colors }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{label}</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <ColorSwatch key={c.name} {...c} />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Design System Preview Page
   ────────────────────────────────────────── */
export default function DesignSystemPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <div className="px-4 py-8 lg:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="Nestify Design System"
        description="Comprehensive UI component library for the PG & Hostel Management Platform"
        breadcrumbs={[
          { label: 'Home', href: '#' },
          { label: 'Design System' },
        ]}
      />

      {/* ━━━━━━━━━━━━━ COLORS ━━━━━━━━━━━━━ */}
      <ContentSection
        title="Color System"
        description="Semantic color tokens used across all components"
      >
        <Card>
          <ColorRow
            label="Primary — Indigo"
            colors={[
              { name: '50', className: 'bg-primary-50', hex: '#EEF2FF' },
              { name: '100', className: 'bg-primary-100', hex: '#E0E7FF' },
              { name: '200', className: 'bg-primary-200', hex: '#C7D2FE' },
              { name: '300', className: 'bg-primary-300', hex: '#A5B4FC' },
              { name: '400', className: 'bg-primary-400', hex: '#818CF8' },
              { name: '500', className: 'bg-primary-500', hex: '#6366F1' },
              { name: '600', className: 'bg-primary-600', hex: '#4338CA' },
              { name: '700', className: 'bg-primary-700', hex: '#3730A3' },
              { name: '800', className: 'bg-primary-800', hex: '#312E81' },
              { name: '900', className: 'bg-primary-900', hex: '#1E1B4B' },
            ]}
          />
          <ColorRow
            label="Secondary / Info — Blue"
            colors={[
              { name: '50', className: 'bg-info-50', hex: '#EFF6FF' },
              { name: '100', className: 'bg-info-100', hex: '#DBEAFE' },
              { name: '300', className: 'bg-info-300', hex: '#93C5FD' },
              { name: '500', className: 'bg-info-500', hex: '#3B82F6' },
              { name: '600', className: 'bg-info-600', hex: '#2563EB' },
              { name: '700', className: 'bg-info-700', hex: '#1D4ED8' },
            ]}
          />
          <ColorRow
            label="Success — Green"
            colors={[
              { name: '50', className: 'bg-success-50', hex: '#F0FDF4' },
              { name: '100', className: 'bg-success-100', hex: '#DCFCE7' },
              { name: '300', className: 'bg-success-300', hex: '#86EFAC' },
              { name: '500', className: 'bg-success-500', hex: '#22C55E' },
              { name: '600', className: 'bg-success-600', hex: '#16A34A' },
              { name: '700', className: 'bg-success-700', hex: '#15803D' },
            ]}
          />
          <ColorRow
            label="Warning — Amber"
            colors={[
              { name: '50', className: 'bg-warning-50', hex: '#FFFBEB' },
              { name: '100', className: 'bg-warning-100', hex: '#FEF3C7' },
              { name: '300', className: 'bg-warning-300', hex: '#FCD34D' },
              { name: '500', className: 'bg-warning-500', hex: '#F59E0B' },
              { name: '600', className: 'bg-warning-600', hex: '#D97706' },
              { name: '700', className: 'bg-warning-700', hex: '#B45309' },
            ]}
          />
          <ColorRow
            label="Danger / Error — Red"
            colors={[
              { name: '50', className: 'bg-danger-50', hex: '#FEF2F2' },
              { name: '100', className: 'bg-danger-100', hex: '#FEE2E2' },
              { name: '300', className: 'bg-danger-300', hex: '#FCA5A5' },
              { name: '500', className: 'bg-danger-500', hex: '#EF4444' },
              { name: '600', className: 'bg-danger-600', hex: '#DC2626' },
              { name: '700', className: 'bg-danger-700', hex: '#B91C1C' },
            ]}
          />
          <ColorRow
            label="Neutrals — Slate"
            colors={[
              { name: '50', className: 'bg-slate-50', hex: '#F8FAFC' },
              { name: '100', className: 'bg-slate-100', hex: '#F1F5F9' },
              { name: '200', className: 'bg-slate-200', hex: '#E2E8F0' },
              { name: '300', className: 'bg-slate-300', hex: '#CBD5E1' },
              { name: '400', className: 'bg-slate-400', hex: '#94A3B8' },
              { name: '500', className: 'bg-slate-500', hex: '#64748B' },
              { name: '600', className: 'bg-slate-600', hex: '#475569' },
              { name: '700', className: 'bg-slate-700', hex: '#334155' },
              { name: '800', className: 'bg-slate-800', hex: '#1E293B' },
              { name: '900', className: 'bg-slate-900', hex: '#0F172A' },
            ]}
          />
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ TYPOGRAPHY ━━━━━━━━━━━━━ */}
      <ContentSection title="Typography" description="Consistent type hierarchy across the platform">
        <Card>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Page Title — text-2xl font-bold</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">Room Availability Dashboard</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Section Title — text-lg font-semibold</span>
              <p className="text-lg font-semibold text-slate-900 mt-1">Monthly Revenue Overview</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Card Title — text-base font-semibold</span>
              <p className="text-base font-semibold text-slate-900 mt-1">Occupancy Rate</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Body — text-sm text-slate-700</span>
              <p className="text-sm text-slate-700 mt-1">The resident check-in for Room 204 has been confirmed for October 1st, 2026. Monthly rent of ₹8,500 is due on the first of each month.</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Secondary — text-sm text-slate-500</span>
              <p className="text-sm text-slate-500 mt-1">Last updated 2 hours ago • 24 active residents</p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Caption — text-xs text-slate-400</span>
              <p className="text-xs text-slate-400 mt-1">All amounts in INR. Prices inclusive of GST where applicable.</p>
            </div>
          </div>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ BUTTONS ━━━━━━━━━━━━━ */}
      <ContentSection title="Buttons" description="Button variants, sizes, and states">
        <Card>
          {/* Variants */}
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Variants</h4>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button variant="primary" leftIcon={Plus}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline" leftIcon={Download}>Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger" leftIcon={Trash2}>Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </div>

          {/* Sizes */}
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Sizes</h4>
          <div className="flex flex-wrap items-end gap-3 mb-6">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>

          {/* States */}
          <h4 className="text-sm font-semibold text-slate-700 mb-3">States</h4>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button>Normal</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>

          {/* With Icons */}
          <h4 className="text-sm font-semibold text-slate-700 mb-3">With Icons</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button leftIcon={Plus}>Add Resident</Button>
            <Button variant="outline" leftIcon={Filter}>Filter</Button>
            <Button variant="secondary" leftIcon={Download}>Export</Button>
            <Button variant="ghost" leftIcon={Edit}>Edit</Button>
            <Button variant="outline" rightIcon={ArrowUpDown} size="sm">Sort</Button>
          </div>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ FORM INPUTS ━━━━━━━━━━━━━ */}
      <ContentSection title="Form Components" description="Inputs, selects, textareas, checkboxes, and radios">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Resident Name"
              placeholder="Enter full name"
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="resident@example.com"
              leftIcon={Mail}
            />
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              error="Phone number is required"
              required
            />
            <Input
              label="Room Number"
              placeholder="e.g., 204"
              helperText="Assign an available room"
            />
            <Input
              label="Search Rooms"
              placeholder="Search by name or number..."
              leftIcon={Search}
            />
            <Input
              label="Disabled Field"
              placeholder="Cannot edit"
              disabled
              value="Locked Value"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Select
              label="Property"
              required
              options={[
                { value: 'prop1', label: 'Sunrise PG — Koramangala' },
                { value: 'prop2', label: 'Green Valley Hostel — Indiranagar' },
                { value: 'prop3', label: 'Metro Stay — HSR Layout' },
              ]}
            />
            <Select
              label="Room Type"
              error="Please select a room type"
              options={[
                { value: 'single', label: 'Single Occupancy' },
                { value: 'double', label: 'Double Sharing' },
                { value: 'triple', label: 'Triple Sharing' },
              ]}
            />
          </div>

          <div className="mb-6">
            <Textarea
              label="Notes"
              placeholder="Add any special instructions or notes for the resident..."
              helperText="Max 500 characters"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Amenities (Checkbox)</p>
              <div className="space-y-2.5">
                <Checkbox label="Wi-Fi" defaultChecked />
                <Checkbox label="AC Room" />
                <Checkbox label="Attached Bathroom" defaultChecked />
                <Checkbox label="Laundry Service" disabled />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Meal Plan (Radio)</p>
              <div className="space-y-2.5">
                <Radio name="meal" label="No Meals" />
                <Radio name="meal" label="Breakfast Only" defaultChecked />
                <Radio name="meal" label="Breakfast & Dinner" />
                <Radio name="meal" label="All Meals" />
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ BADGES ━━━━━━━━━━━━━ */}
      <ContentSection title="Status Badges" description="Semantic status indicators for PG/Hostel workflows">
        <Card>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Payment Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge status="paid" dot>Paid</Badge>
                <Badge status="pending" dot>Pending</Badge>
                <Badge status="partial" dot>Partial</Badge>
                <Badge status="overdue" dot>Overdue</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Room Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge status="available" dot>Available</Badge>
                <Badge status="occupied" dot>Occupied</Badge>
                <Badge status="upcoming" dot>Reserved</Badge>
                <Badge status="inactive" dot>Under Maintenance</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Resident Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge status="active" dot>Active</Badge>
                <Badge status="verified" dot>Verified</Badge>
                <Badge status="pending" dot>Pending Approval</Badge>
                <Badge status="blocked" dot>Blocked</Badge>
                <Badge status="inactive" dot>Inactive</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info" size="sm">Small</Badge>
                <Badge variant="info" size="md">Medium</Badge>
                <Badge variant="info" size="lg">Large</Badge>
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ CARDS ━━━━━━━━━━━━━ */}
      <ContentSection title="Cards" description="Card layouts with compound sub-components">
        <CardGrid cols={3}>
          <Card>
            <Card.Header>
              <Card.Title>Total Residents</Card.Title>
              <Card.Description>Active residents across properties</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">248</span>
                <Badge variant="success" size="sm">+12%</Badge>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Occupancy Rate</Card.Title>
              <Card.Description>Overall bed occupancy</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">87%</span>
                <Badge variant="warning" size="sm">-3%</Badge>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Revenue (Monthly)</Card.Title>
              <Card.Description>Current month collection</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">₹4.2L</span>
                <Badge variant="success" size="sm">+8%</Badge>
              </div>
            </Card.Content>
          </Card>
        </CardGrid>

        <div className="mt-6">
          <Card hover className="max-w-md">
            <Card.Header>
              <div className="flex items-center gap-3">
                <Avatar name="Priya Sharma" size="md" />
                <div>
                  <Card.Title>Priya Sharma</Card.Title>
                  <Card.Description>Room 204 • Double Sharing</Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Rent: ₹8,500/mo</span>
                <Badge status="paid" dot>Paid</Badge>
              </div>
            </Card.Content>
            <Card.Footer>
              <Button variant="outline" size="sm" leftIcon={Eye}>View</Button>
              <Button variant="ghost" size="sm" leftIcon={Edit}>Edit</Button>
            </Card.Footer>
          </Card>
        </div>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ ALERTS ━━━━━━━━━━━━━ */}
      <ContentSection title="Alerts" description="Contextual feedback messages">
        <div className="space-y-3">
          <Alert variant="info" title="System Update">
            Scheduled maintenance window on Sunday, Oct 5th from 2:00 AM to 4:00 AM IST.
          </Alert>
          <Alert variant="success" title="Payment Received">
            ₹8,500 received from Priya Sharma (Room 204) for October rent.
          </Alert>
          <Alert variant="warning" title="Rent Due Soon" dismissible>
            12 residents have rent payments due within the next 3 days.
          </Alert>
          <Alert variant="danger" title="Overdue Payments">
            5 residents have overdue payments totaling ₹42,500.
          </Alert>
        </div>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ TABLE ━━━━━━━━━━━━━ */}
      <ContentSection title="Table" description="Data table with sortable columns">
        <Card padding="none">
          <Table
            columns={[
              {
                header: 'Resident',
                accessor: 'name',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <Avatar name={row.name} size="sm" />
                    <div>
                      <p className="font-medium text-slate-900">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                  </div>
                ),
              },
              { header: 'Room', accessor: 'room' },
              { header: 'Property', accessor: 'property' },
              { header: 'Rent', accessor: 'rent', align: 'right' },
              {
                header: 'Status',
                accessor: 'status',
                render: (row) => <Badge status={row.status} dot>{row.statusLabel}</Badge>,
              },
              {
                header: '',
                accessor: 'actions',
                align: 'right',
                render: () => (
                  <Dropdown
                    align="right"
                    trigger={
                      <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </button>
                    }
                    items={[
                      { label: 'View Details', icon: Eye, onClick: () => {} },
                      { label: 'Edit Resident', icon: Edit, onClick: () => {} },
                      { label: 'Copy Email', icon: Copy, onClick: () => {} },
                      { divider: true },
                      { label: 'Remove', icon: Trash2, danger: true, onClick: () => {} },
                    ]}
                  />
                ),
              },
            ]}
            data={[
              { name: 'Priya Sharma', email: 'priya@mail.com', room: '204', property: 'Sunrise PG', rent: '₹8,500', status: 'paid', statusLabel: 'Paid' },
              { name: 'Rahul Kumar', email: 'rahul@mail.com', room: '105', property: 'Green Valley', rent: '₹7,000', status: 'pending', statusLabel: 'Pending' },
              { name: 'Anita Desai', email: 'anita@mail.com', room: '312', property: 'Metro Stay', rent: '₹9,200', status: 'overdue', statusLabel: 'Overdue' },
              { name: 'Vikram Singh', email: 'vikram@mail.com', room: '201', property: 'Sunrise PG', rent: '₹6,500', status: 'paid', statusLabel: 'Paid' },
              { name: 'Meera Patel', email: 'meera@mail.com', room: '108', property: 'Green Valley', rent: '₹7,000', status: 'active', statusLabel: 'Active' },
            ]}
          />
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ TABS ━━━━━━━━━━━━━ */}
      <ContentSection title="Tabs" description="Tabbed navigation with counts">
        <Card>
          <Tabs
            tabs={[
              {
                id: 'all',
                label: 'All Residents',
                icon: Users,
                count: 248,
                content: (
                  <div className="text-sm text-slate-600">
                    Showing all 248 residents across 3 properties. Use filters to narrow your search.
                  </div>
                ),
              },
              {
                id: 'active',
                label: 'Active',
                count: 220,
                content: (
                  <div className="text-sm text-slate-600">
                    220 residents currently active with valid check-in dates.
                  </div>
                ),
              },
              {
                id: 'pending',
                label: 'Pending',
                count: 18,
                content: (
                  <div className="text-sm text-slate-600">
                    18 residents awaiting approval or verification.
                  </div>
                ),
              },
              {
                id: 'inactive',
                label: 'Inactive',
                count: 10,
                content: (
                  <div className="text-sm text-slate-600">
                    10 residents have checked out or been deactivated.
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ AVATARS & TOOLTIPS ━━━━━━━━━━━━━ */}
      <ContentSection title="Avatars & Tooltips" description="User avatars with tooltip support">
        <Card>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Tooltip content="Priya Sharma"><Avatar name="Priya Sharma" size="xs" /></Tooltip>
            <Tooltip content="Rahul Kumar"><Avatar name="Rahul Kumar" size="sm" /></Tooltip>
            <Tooltip content="Anita Desai"><Avatar name="Anita Desai" size="md" /></Tooltip>
            <Tooltip content="Vikram Singh"><Avatar name="Vikram Singh" size="lg" /></Tooltip>
            <Tooltip content="Default Avatar"><Avatar size="lg" /></Tooltip>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip content="Top tooltip" position="top"><Button variant="outline" size="sm">Top</Button></Tooltip>
            <Tooltip content="Right tooltip" position="right"><Button variant="outline" size="sm">Right</Button></Tooltip>
            <Tooltip content="Bottom tooltip" position="bottom"><Button variant="outline" size="sm">Bottom</Button></Tooltip>
            <Tooltip content="Left tooltip" position="left"><Button variant="outline" size="sm">Left</Button></Tooltip>
          </div>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ MODAL ━━━━━━━━━━━━━ */}
      <ContentSection title="Modal" description="Dialog overlay with focus trap">
        <Card>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Add New Resident"
            description="Fill in the details to register a new resident."
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setModalOpen(false)}>Save Resident</Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="Full Name" placeholder="Enter resident name" required />
              <Input label="Email" type="email" placeholder="resident@email.com" leftIcon={Mail} />
              <Select
                label="Room"
                required
                options={[
                  { value: '201', label: 'Room 201 — Single' },
                  { value: '204', label: 'Room 204 — Double' },
                  { value: '312', label: 'Room 312 — Triple' },
                ]}
              />
            </div>
          </Modal>
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ PAGINATION ━━━━━━━━━━━━━ */}
      <ContentSection title="Pagination" description="Page navigation control">
        <Card>
          <Pagination
            currentPage={currentPage}
            totalPages={12}
            onPageChange={setCurrentPage}
          />
        </Card>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ LOADING STATES ━━━━━━━━━━━━━ */}
      <ContentSection title="Loading States" description="Skeleton loaders and spinners">
        <CardGrid cols={2}>
          <Card>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Skeleton — Card</h4>
            <Skeleton.Card />
          </Card>
          <Card>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Skeleton — Text</h4>
            <Skeleton.Text lines={4} />
            <div className="flex items-center gap-3 mt-4">
              <Skeleton.Avatar />
              <div className="flex-1 space-y-2">
                <Skeleton height="0.75rem" width="50%" />
                <Skeleton height="0.6rem" width="30%" />
              </div>
            </div>
          </Card>
        </CardGrid>
        <div className="mt-6">
          <Card>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Spinner</h4>
            <div className="flex items-center gap-8">
              <LoadingState size="sm" text="Loading..." />
              <LoadingState size="md" text="Fetching rooms..." />
              <LoadingState size="lg" text="Processing payment..." />
            </div>
          </Card>
        </div>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ EMPTY STATE ━━━━━━━━━━━━━ */}
      <ContentSection title="Empty State" description="Zero-data feedback patterns">
        <CardGrid cols={2}>
          <Card>
            <EmptyState
              icon={Users}
              title="No residents found"
              description="There are no residents matching your filter criteria. Try adjusting your search or add a new resident."
              actionLabel="Add Resident"
              onAction={() => {}}
            />
          </Card>
          <Card>
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Invoices will appear here once you generate billing for your residents."
            />
          </Card>
        </CardGrid>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ STAT CARDS ━━━━━━━━━━━━━ */}
      <ContentSection title="Stat Cards" description="Dashboard KPI cards pattern">
        <CardGrid cols={4}>
          {[
            { label: 'Total Properties', value: '6', icon: Building2, change: '+1', variant: 'info' },
            { label: 'Total Rooms', value: '142', icon: BedDouble, change: '+8', variant: 'success' },
            { label: 'Active Residents', value: '248', icon: Users, change: '+12', variant: 'success' },
            { label: 'Monthly Revenue', value: '₹4.2L', icon: IndianRupee, change: '+8%', variant: 'success' },
          ].map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <stat.icon size={20} className="text-primary-600" />
                </div>
              </div>
              <div className="mt-3">
                <Badge variant={stat.variant} size="sm">{stat.change}</Badge>
                <span className="text-xs text-slate-500 ml-2">vs last month</span>
              </div>
            </Card>
          ))}
        </CardGrid>
      </ContentSection>

      {/* ━━━━━━━━━━━━━ DROPDOWN ━━━━━━━━━━━━━ */}
      <ContentSection title="Dropdown" description="Action menus with icon support">
        <Card>
          <div className="flex gap-4">
            <Dropdown
              items={[
                { label: 'View Profile', icon: Eye, onClick: () => {} },
                { label: 'Edit Details', icon: Edit, onClick: () => {} },
                { label: 'Copy ID', icon: Copy, onClick: () => {} },
                { divider: true },
                { label: 'Delete', icon: Trash2, danger: true, onClick: () => {} },
              ]}
            />
            <Dropdown
              align="right"
              trigger={
                <Button variant="outline" size="sm" rightIcon={Filter}>
                  Actions
                </Button>
              }
              items={[
                { label: 'Export CSV', icon: Download, onClick: () => {} },
                { label: 'Print Report', icon: FileText, onClick: () => {} },
                { label: 'Send Reminder', icon: Mail, onClick: () => {} },
              ]}
            />
          </div>
        </Card>
      </ContentSection>
    </div>
  );
}
